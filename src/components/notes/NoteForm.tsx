"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types";
import { useNoteStore } from "@/stores/noteStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useUIStore } from "@/stores/uiStore";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface NoteFormProps {
  note?: Note;
  onClose?: () => void;
}

export function NoteForm({ note, onClose }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [categoryId, setCategoryId] = useState<string | null>(
    note?.categoryId || null
  );
  const [tagsInput, setTagsInput] = useState(note?.tags.join(", ") || "");

  const { createNote, updateNote } = useNoteStore();
  const { categories } = useCategoryStore();
  const { activeCategoryId, setSelectedNoteId } = useUIStore();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategoryId(note.categoryId);
      setTagsInput(note.tags.join(", "));
    } else {
      setTitle("");
      setContent("");
      setCategoryId(activeCategoryId);
      setTagsInput("");
    }
  }, [note, activeCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (note) {
      await updateNote(note.id, { title, content, categoryId, tags });
    } else {
      const newNote = await createNote({
        title,
        content,
        categoryId,
        tags,
        isPinned: false,
      });
      setSelectedNoteId(newNote.id);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          rows={6}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value || null)}
          className="flex h-7 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Tags
        </label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
        <p className="mt-0.5 text-[10px] text-gray-500">Separate tags with commas</p>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit">{note ? "Update" : "Create"}</Button>
      </div>
    </form>
  );
}
