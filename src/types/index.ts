export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string | null;
  tags: string[];
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface ExportData {
  schema_version: number;
  exported_at: string;
  notes: Note[];
  categories: Category[];
}

export type ImportMode = "merge" | "replace";

export interface SearchResult {
  id: string;
  score: number;
  terms: string[];
  match: Record<string, string[]>;
}
