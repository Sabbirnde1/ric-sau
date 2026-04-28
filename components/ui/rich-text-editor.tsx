'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Label } from '@/components/ui/label';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false, 
  loading: () => <div className="h-64 w-full bg-neutral-100 animate-pulse rounded-md" />
});

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number; // Kept for compatibility, though Quill doesn't use rows
}

export default function RichTextEditor({ 
  label = 'Content',
  value, 
  onChange, 
  placeholder, 
  className 
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link',
  ];

  return (
    <div className={`space-y-3 ${className || ''}`}>
      {label && <Label>{label}</Label>}
      <div className="rich-text-container border rounded-md">
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || 'Write something amazing...'}
          className="bg-white text-black rounded-md"
        />
      </div>
      <style jsx global>{`
        .rich-text-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: #f9fafb;
          border-color: #e5e7eb !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
        }
        .rich-text-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-size: 1rem;
          border-color: #e5e7eb !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          font-family: inherit;
          min-height: 12rem;
        }
        .rich-text-container .ql-editor {
          min-height: 12rem;
          padding: 1rem;
        }
        .rich-text-container .ql-editor p {
          margin-bottom: 0.75rem;
        }
        .rich-text-container .ql-editor h1,
        .rich-text-container .ql-editor h2,
        .rich-text-container .ql-editor h3 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-text-container .ql-editor h1 { font-size: 1.875rem; }
        .rich-text-container .ql-editor h2 { font-size: 1.5rem; }
        .rich-text-container .ql-editor h3 { font-size: 1.25rem; }
        .rich-text-container .ql-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-text-container .ql-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .rich-text-container .ql-editor a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rich-text-container .ql-editor blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
