import Dexie, { type Table } from "dexie";
import type { Note, Category } from "@/types";

export class NoteVaultDB extends Dexie {
  notes!: Table<Note>;
  categories!: Table<Category>;

  constructor() {
    super("NoteVaultDB");
    this.version(1).stores({
      notes: "id, title, categoryId, isPinned, createdAt, updatedAt, *tags",
      categories: "id, name, createdAt",
    });
  }
}

export const db = new NoteVaultDB();

export function generateId(): string {
  return crypto.randomUUID();
}
