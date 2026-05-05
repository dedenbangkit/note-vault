import { create } from "zustand";
import { db, generateId } from "@/lib/db";
import type { Note } from "@/types";
import {
  rebuildSearchIndex,
  addToSearchIndex,
  removeFromSearchIndex,
  updateInSearchIndex,
} from "@/lib/search";

interface NoteStore {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  createNote: (
    note: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  getNotesByCategory: (categoryId: string | null) => Note[];
  clearCategoryFromNotes: (categoryId: string) => void;
  clearAllNotes: () => Promise<void>;
  importNotes: (notes: Note[]) => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isLoading: true,

  loadNotes: async () => {
    set({ isLoading: true });
    const notes = await db.notes.toArray();
    rebuildSearchIndex(notes);
    set({ notes, isLoading: false });
  },

  createNote: async (noteData) => {
    const now = Date.now();
    const note: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.notes.add(note);
    addToSearchIndex(note);
    set((state) => ({ notes: [...state.notes, note] }));
    return note;
  },

  updateNote: async (id, updates) => {
    const updatedAt = Date.now();
    await db.notes.update(id, { ...updates, updatedAt });
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt } : note
      ),
    }));
    const updatedNote = get().notes.find((n) => n.id === id);
    if (updatedNote) {
      updateInSearchIndex(updatedNote);
    }
  },

  deleteNote: async (id) => {
    await db.notes.delete(id);
    removeFromSearchIndex(id);
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (note) {
      await get().updateNote(id, { isPinned: !note.isPinned });
    }
  },

  getNoteById: (id) => {
    return get().notes.find((note) => note.id === id);
  },

  getNotesByCategory: (categoryId) => {
    if (categoryId === null) {
      return get().notes;
    }
    return get().notes.filter((note) => note.categoryId === categoryId);
  },

  clearCategoryFromNotes: (categoryId) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.categoryId === categoryId ? { ...note, categoryId: null } : note
      ),
    }));
  },

  clearAllNotes: async () => {
    await db.notes.clear();
    rebuildSearchIndex([]);
    set({ notes: [] });
  },

  importNotes: async (notes) => {
    await db.notes.bulkPut(notes);
    const allNotes = await db.notes.toArray();
    rebuildSearchIndex(allNotes);
    set({ notes: allNotes });
  },
}));
