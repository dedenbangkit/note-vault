"use client";

import { useState } from "react";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { NoteForm } from "@/components/notes/NoteForm";
import { CopyButton } from "@/components/notes/CopyButton";
import { formatDateTime } from "@/lib/utils";

export function NoteEditor() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { selectedNoteId, setSelectedNoteId } = useUIStore();
  const { getNoteById, deleteNote, togglePin } = useNoteStore();
  const { getCategoryById } = useCategoryStore();

  const note = selectedNoteId ? getNoteById(selectedNoteId) : null;
  const category = note?.categoryId ? getCategoryById(note.categoryId) : null;

  const handleDelete = async () => {
    if (note) {
      await deleteNote(note.id);
      setSelectedNoteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  if (!note) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Select a note to view or edit
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {category && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
          )}
          {note.isPinned && (
            <span className="text-xs text-yellow-500">Pinned</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={note.content} />
          <button
            onClick={() => togglePin(note.id)}
            className={`rounded p-2 ${
              note.isPinned
                ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.828 3.414l3.536 3.535 1.414-1.414A2 2 0 1116.192.707l-3.536 3.535L9.828 3.414zM8 6.828L2.929 11.9l5.657 5.656L14.657 8.485 8 6.828zM2.222 13.86l3.536 3.536-4.243.707.707-4.243z" />
            </svg>
          </button>
          <Button size="sm" variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {note.title || "Untitled"}
        </h1>

        <div className="mb-6 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
            {note.content}
          </pre>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-3 text-xs text-gray-400 dark:border-gray-700">
        <span>Created: {formatDateTime(note.createdAt)}</span>
        <span className="mx-2">•</span>
        <span>Updated: {formatDateTime(note.updatedAt)}</span>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Note"
        className="max-w-lg"
      >
        <NoteForm note={note} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Note"
      >
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Are you sure you want to delete &quot;{note.title || "Untitled"}&quot;? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
