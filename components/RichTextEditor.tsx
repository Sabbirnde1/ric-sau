'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false, 
  loading: () => <div className="h-64 w-full bg-neutral-800 animate-pulse rounded-md" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
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
    <div className={`rich-text-container ${className || ''}`}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write something amazing...'}
        className="bg-white text-black rounded-md"
      />
      <style jsx global>{`
        .rich-text-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        .rich-text-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          font-size: 1rem;
          border-color: #d1d5db;
          min-height: 12rem;
        }
        .rich-text-container .ql-editor {
          min-height: 12rem;
        }
        .rich-text-container .ql-editor p {
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
}
