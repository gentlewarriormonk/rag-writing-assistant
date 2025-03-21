'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  documentCount: number;
}

interface CategoriesProps {
  categories: Category[];
  onAddCategory: (name: string) => Promise<void>;
  onRenameCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onFilterByCategory: (id: string | null) => void;
  activeCategory: string | null;
}

export function Categories({
  categories,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onFilterByCategory,
  activeCategory,
}: CategoriesProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddCategory(newCategoryName);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory(id);
    setEditName(name);
  };

  const handleSaveCategory = async (id: string) => {
    if (!editName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onRenameCategory(id, editName);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to rename category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? The documents will not be deleted, but they will become uncategorized.')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onDeleteCategory(id);
    } catch (error) {
      console.error('Failed to delete category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Categories</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingCategory(true)}
          className="h-8"
          disabled={isAddingCategory}
        >
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          <div
            className={`flex items-center justify-between p-2 rounded-md ${
              activeCategory === null ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } cursor-pointer`}
            onClick={() => onFilterByCategory(null)}
          >
            <div className="flex items-center">
              <span className="font-medium">All Documents</span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({categories.reduce((sum, cat) => sum + cat.documentCount, 0)})
              </span>
            </div>
          </div>

          {isAddingCategory && (
            <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') setIsAddingCategory(false);
                }}
              />
              <div className="flex ml-2">
                <Button 
                  size="sm" 
                  onClick={handleAddCategory}
                  disabled={isSubmitting}
                  className="mr-1"
                >
                  Add
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                activeCategory === category.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {editingCategory === category.id ? (
                <div className="flex flex-1 items-center">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveCategory(category.id);
                      if (e.key === 'Escape') setEditingCategory(null);
                    }}
                  />
                  <div className="flex ml-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveCategory(category.id)}
                      disabled={isSubmitting}
                      className="h-7 text-xs"
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                      disabled={isSubmitting}
                      className="ml-1 h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => onFilterByCategory(category.id)}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({category.documentCount})
                    </span>
                  </div>
                  <div className="flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category.id, category.name);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Edit category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                      aria-label="Delete category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 