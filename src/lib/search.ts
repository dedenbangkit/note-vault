import MiniSearch from "minisearch";
import type { Note } from "@/types";

let searchIndex: MiniSearch<Note> | null = null;

export function createSearchIndex(): MiniSearch<Note> {
  return new MiniSearch<Note>({
    fields: ["title", "content", "tags"],
    storeFields: ["id", "title", "content", "categoryId", "tags", "isPinned"],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
    extractField: (document, fieldName) => {
      const note = document as Note;
      if (fieldName === "tags") {
        return note.tags.join(" ");
      }
      return (note as unknown as Record<string, string>)[fieldName];
    },
  });
}

export function getSearchIndex(): MiniSearch<Note> {
  if (!searchIndex) {
    searchIndex = createSearchIndex();
  }
  return searchIndex;
}

export function rebuildSearchIndex(notes: Note[]): void {
  searchIndex = createSearchIndex();
  searchIndex.addAll(notes);
}

export function addToSearchIndex(note: Note): void {
  const index = getSearchIndex();
  index.add(note);
}

export function removeFromSearchIndex(noteId: string): void {
  const index = getSearchIndex();
  index.discard(noteId);
}

export function updateInSearchIndex(note: Note): void {
  const index = getSearchIndex();
  index.discard(note.id);
  index.add(note);
}

export function searchNotes(query: string): string[] {
  if (!query.trim()) return [];
  const index = getSearchIndex();
  const results = index.search(query);
  return results.map((result) => result.id);
}
