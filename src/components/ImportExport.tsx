"use client";

import { useState, useRef } from "react";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ExportData, ImportMode } from "@/types";
import { downloadJson, getBackupFilename } from "@/lib/utils";

export function ImportExport() {
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [importResult, setImportResult] = useState<{
    notes: number;
    categories: number;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { notes, importNotes, clearAllNotes } = useNoteStore();
  const { categories, importCategories, clearAllCategories } = useCategoryStore();
  const { isImportModalOpen, setIsImportModalOpen, setSelectedNoteId } = useUIStore();

  const handleExport = () => {
    const exportData: ExportData = {
      schema_version: 1,
      exported_at: new Date().toISOString(),
      notes,
      categories,
    };
    downloadJson(exportData, getBackupFilename());
  };

  const handleImportClick = () => {
    setImportResult(null);
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as ExportData;

      if (!data.schema_version || !data.notes || !data.categories) {
        throw new Error("Invalid backup file format");
      }

      if (importMode === "replace") {
        await clearAllNotes();
        await clearAllCategories();
        setSelectedNoteId(null);
      }

      if (importMode === "merge") {
        const existingNoteIds = new Set(notes.map((n) => n.id));
        const existingCatIds = new Set(categories.map((c) => c.id));

        const newNotes = data.notes.filter((n) => !existingNoteIds.has(n.id));
        const newCategories = data.categories.filter(
          (c) => !existingCatIds.has(c.id)
        );

        await importCategories(newCategories);
        await importNotes(newNotes);

        setImportResult({
          notes: newNotes.length,
          categories: newCategories.length,
        });
      } else {
        await importCategories(data.categories);
        await importNotes(data.notes);

        setImportResult({
          notes: data.notes.length,
          categories: data.categories.length,
        });
      }

      setIsImportModalOpen(true);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : "Failed to import backup"
      );
      setIsImportModalOpen(true);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <select
            value={importMode}
            onChange={(e) => setImportMode(e.target.value as ImportMode)}
            className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="merge">Merge</option>
            <option value="replace">Replace</option>
          </select>
          <Button size="sm" variant="secondary" onClick={handleImportClick}>
            Import
          </Button>
        </div>

        <Button size="sm" variant="secondary" onClick={handleExport}>
          Export
        </Button>
      </div>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={importError ? "Import Error" : "Import Complete"}
      >
        {importError ? (
          <div className="text-red-600 dark:text-red-400">{importError}</div>
        ) : importResult ? (
          <div className="text-gray-700 dark:text-gray-300">
            <p>Successfully imported:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>{importResult.notes} notes</li>
              <li>{importResult.categories} categories</li>
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setIsImportModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
