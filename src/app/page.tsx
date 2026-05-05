"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { NoteList } from "@/components/layout/NoteList";
import { NoteEditor } from "@/components/layout/NoteEditor";
import { ImportExport } from "@/components/ImportExport";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useUIStore } from "@/stores/uiStore";

export default function Home() {
  const { loadNotes } = useNoteStore();
  const { loadCategories } = useCategoryStore();
  const { initializeDarkMode, setSelectedNoteId, setIsSearchOpen } = useUIStore();

  useEffect(() => {
    initializeDarkMode();
    loadCategories();
    loadNotes();
  }, [initializeDarkMode, loadCategories, loadNotes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>('[data-new-note]')?.click();
      }

      if (e.key === "Escape") {
        setSelectedNoteId(null);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedNoteId, setIsSearchOpen]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              ⌘K
            </kbd>{" "}
            Search{" "}
            <kbd className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              ⌘N
            </kbd>{" "}
            New Note
          </div>
          <ImportExport />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <NoteList />
          <NoteEditor />
        </div>
      </div>
    </div>
  );
}
