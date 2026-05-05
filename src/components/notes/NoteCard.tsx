"use client";

import { Note, Category } from "@/types";
import { useUIStore } from "@/stores/uiStore";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { selectedNoteId, setSelectedNoteId } = useUIStore();
  const { togglePin } = useNoteStore();
  const { getCategoryById } = useCategoryStore();

  const category = note.categoryId ? getCategoryById(note.categoryId) : null;
  const isSelected = selectedNoteId === note.id;

  return (
    <div
      onClick={() => setSelectedNoteId(note.id)}
      className={cn(
        "cursor-pointer rounded-lg border p-4 transition-all",
        isSelected
          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {note.title || "Untitled"}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(note.id);
            }}
            className={cn(
              "rounded p-1 transition-colors",
              note.isPinned
                ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.828 3.414l3.536 3.535 1.414-1.414A2 2 0 1116.192.707l-3.536 3.535L9.828 3.414zM8 6.828L2.929 11.9l5.657 5.656L14.657 8.485 8 6.828zM2.222 13.86l3.536 3.536-4.243.707.707-4.243z" />
            </svg>
          </button>
        </div>
      </div>

      {note.content && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {truncate(note.content, 100)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
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
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <span className="text-xs text-gray-400">{formatDate(note.updatedAt)}</span>
        <CopyButton text={note.content} />
      </div>
    </div>
  );
}
