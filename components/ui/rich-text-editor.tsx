'use client';

import { useState } from 'react';
import { Bold, Italic, List, Link as LinkIcon, Heading1, Heading2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export default function RichTextEditor({ 
  label = 'Content', 
  value, 
  onChange, 
  rows = 10,
  placeholder = 'Enter content here...'
}: RichTextEditorProps) {
  const [cursorPos, setCursorPos] = useState(0);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ', '') },
    { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ', '') },
    { icon: List, label: 'List', action: () => insertMarkdown('- ', '') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '') },
    { icon: LinkIcon, label: 'Link', action: () => insertMarkdown('[', '](url)') },
  ];

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border rounded-lg">
            {formatButtons.map((btn, idx) => (
              <Button
                key={idx}
                type="button"
                variant="ghost"
                size="sm"
                onClick={btn.action}
                title={btn.label}
                className="h-8 w-8 p-0"
              >
                <btn.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Editor */}
          <Textarea
            id="rich-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={(e) => setCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
            rows={rows}
            placeholder={placeholder}
            className="font-mono text-sm"
          />

          <p className="text-xs text-gray-500">
            Supports Markdown: **bold**, *italic*, # Heading, - List, {'>'} Quote, [link](url)
          </p>
        </TabsContent>

        <TabsContent value="preview">
          <div 
            className="min-h-[200px] p-4 border rounded-lg bg-white prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
