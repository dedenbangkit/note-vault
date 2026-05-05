"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { NoteList } from "@/components/layout/NoteList";
import { NoteEditor } from "@/components/layout/NoteEditor";
import { ImportExport } from "@/components/ImportExport";
import { SearchBar } from "@/components/ui/SearchBar";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useUIStore } from "@/stores/uiStore";

function HeaderSearch() {
  return <SearchBar />;
}

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
        <header className="flex items-center gap-2 border-b border-gray-200 px-3 py-1.5 dark:border-gray-700">
          <div className="flex-1">
            <HeaderSearch />
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
