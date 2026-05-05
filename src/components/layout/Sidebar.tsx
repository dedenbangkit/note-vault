"use client";

import { useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import { useNoteStore } from "@/stores/noteStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string; noteCount: number } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

  const { categories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { notes, clearCategoryFromNotes } = useNoteStore();
  const {
    activeCategoryId,
    setActiveCategoryId,
    isSidebarOpen,
    toggleSidebar,
    isDarkMode,
    toggleDarkMode,
  } = useUIStore();

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsCreateModalOpen(false);
    }
  };

  const getCategoryNoteCount = (categoryId: string | null | "uncategorized") => {
    if (categoryId === null) {
      return notes.length;
    }
    if (categoryId === "uncategorized") {
      return notes.filter((note) => !note.categoryId).length;
    }
    return notes.filter((note) => note.categoryId === categoryId).length;
  };

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    const noteCount = getCategoryNoteCount(categoryId);
    if (noteCount > 0) {
      setDeletingCategory({ id: categoryId, name: categoryName, noteCount });
    } else {
      deleteCategory(categoryId);
    }
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      clearCategoryFromNotes(deletingCategory.id);
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editingCategory.name.trim()) {
      await updateCategory(editingCategory.id, { name: editingCategory.name.trim() });
      setEditingCategory(null);
    }
  };

  return (
    <>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-gray-200 bg-gray-50 transition-all dark:border-gray-700 dark:bg-gray-900",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
          <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Note Vault
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleSidebar}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2 space-y-0.5">
            <button
              onClick={() => setActiveCategoryId(null)}
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium transition-colors",
                activeCategoryId === null
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <span>All Notes</span>
              <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-700">
                {getCategoryNoteCount(null)}
              </span>
            </button>
            <button
              onClick={() => setActiveCategoryId("uncategorized")}
              className={cn(
                "flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium transition-colors",
                activeCategoryId === "uncategorized"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <span>Uncategorized</span>
              <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-700">
                {getCategoryNoteCount("uncategorized")}
              </span>
            </button>
          </div>

          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-0.5">
            {categories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "group flex items-center justify-between rounded px-2 py-1 text-xs transition-colors",
                  activeCategoryId === category.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <button
                  onClick={() => setActiveCategoryId(category.id)}
                  className="flex flex-1 items-center gap-1.5 min-w-0"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </button>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                    className="rounded p-0.5 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category.id, category.name)}
                    className="rounded p-0.5 text-gray-400 opacity-0 hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] dark:bg-gray-700">
                    {getCategoryNoteCount(category.id)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Category"
      >
        <form onSubmit={handleCreateCategory}>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            autoFocus
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
      >
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Are you sure you want to delete &quot;{deletingCategory?.name}&quot;?
          This category has <strong>{deletingCategory?.noteCount}</strong> note{deletingCategory?.noteCount !== 1 ? 's' : ''}.
          The notes will remain but will have no category.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingCategory(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        <form onSubmit={handleEditCategory}>
          <Input
            value={editingCategory?.name || ""}
            onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
            placeholder="Category name"
            autoFocus
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingCategory(null)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
