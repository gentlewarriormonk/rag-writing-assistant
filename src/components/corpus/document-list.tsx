'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  category?: string;
  fileType: string;
  uploadDate: string;
  size: string;
  wordCount?: number;
}

interface DocumentListProps {
  documents: Document[];
  onViewDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onEditCategory: (id: string, category: string) => void;
}

export function DocumentList({
  documents,
  onViewDocument,
  onDeleteDocument,
  onEditCategory,
}: DocumentListProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryValue, setCategoryValue] = useState<string>('');

  const handleEditCategory = (id: string, currentCategory: string = '') => {
    setEditingCategory(id);
    setCategoryValue(currentCategory);
  };

  const handleSaveCategory = (id: string) => {
    onEditCategory(id, categoryValue);
    setEditingCategory(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left font-medium">Document</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Upload Date</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Size</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="mr-3 text-gray-400">
                          {doc.fileType === 'pdf' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                            </svg>
                          ) : doc.fileType === 'docx' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
                              <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{doc.title}</p>
                          {doc.wordCount && <p className="text-xs text-gray-500">{doc.wordCount.toLocaleString()} words</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingCategory === doc.id ? (
                        <div className="flex">
                          <input
                            type="text"
                            value={categoryValue}
                            onChange={(e) => setCategoryValue(e.target.value)}
                            className="mr-2 px-2 py-1 border rounded text-sm w-full max-w-[120px]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCategory(doc.id);
                            }}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveCategory(doc.id)}
                            className="px-2 py-1 h-auto text-xs"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleEditCategory(doc.id, doc.category)}
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {doc.category || 'Uncategorized'}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ml-1 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {formatDate(doc.uploadDate)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{doc.size}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="mr-2"
                          onClick={() => onViewDocument(doc.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteDocument(doc.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 