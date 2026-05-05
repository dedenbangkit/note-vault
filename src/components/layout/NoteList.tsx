"use client";

import { useMemo, useState } from "react";
import { useNoteStore } from "@/stores/noteStore";
import { useUIStore } from "@/stores/uiStore";
import { NoteCard } from "@/components/notes/NoteCard";
import { Modal } from "@/components/ui/Modal";
import { NoteForm } from "@/components/notes/NoteForm";
import { Button } from "@/components/ui/Button";
import { searchNotes } from "@/lib/search";

export function NoteList() {
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const { notes, isLoading } = useNoteStore();
  const { activeCategoryId, searchQuery, isSidebarOpen, toggleSidebar } = useUIStore();

  const filteredNotes = useMemo(() => {
    let result = notes;

    if (activeCategoryId === "uncategorized") {
      result = result.filter((note) => !note.categoryId);
    } else if (activeCategoryId !== null) {
      result = result.filter((note) => note.categoryId === activeCategoryId);
    }

    if (searchQuery.trim()) {
      const matchingIds = searchNotes(searchQuery);
      result = result.filter((note) => matchingIds.includes(note.id));
    }

    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes, activeCategoryId, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-white dark:bg-gray-950">
        <div className="flex items-center justify-center flex-1">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="flex items-center gap-1 border-b border-gray-200 px-2 py-1.5 dark:border-gray-700">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <Button
          onClick={() => setIsNewNoteModalOpen(true)}
          className="flex-1"
          size="sm"
          data-new-note
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Note
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "No notes found matching your search"
                : "No notes yet. Create your first note!"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        title="Create Note"
        className="max-w-lg"
      >
        <NoteForm onClose={() => setIsNewNoteModalOpen(false)} />
      </Modal>
    </div>
  );
}
