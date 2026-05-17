'use client';

import { Button } from '../../components/foundation/button/button';
import { cn } from '@/utils/tw-merge';
import HighlightExtension from '@tiptap/extension-highlight';
import TextAlignExtension from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import type { Extension } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Minus,
  Redo,
  Undo,
} from 'lucide-react';
import { Card } from '@/components/card';

const TextAlign = TextAlignExtension as Extension;
const Highlight = HighlightExtension as Extension;

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
};

export function RichTextEditor({
  label,
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none text-white focus:outline-none min-h-64 max-h-[250px] overflow-y-auto relative scrollbar-none px-3 py-2',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    { type: 'separator' },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Heading 2',
    },
    { type: 'separator' },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Numbered List',
    },

    { type: 'separator' },
    {
      icon: Minus,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
      tooltip: 'Horizontal Rule',
    },
    { type: 'separator' },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      tooltip: 'Undo',
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      tooltip: 'Redo',
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="relative mb-4 flex flex-col gap-1 pt-2">
      <label className="pb-1 text-sm">{label}</label>
      <Card className={cn(className, 'border border-gray-700')}>
        <div className="flex flex-wrap gap-1 rounded-t-xl border border-gray-700 bg-gray-600 px-3 py-1">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'separator') {
              return <div key={index} className="mx-1 h-8 w-px bg-white" />;
            }
            const Icon = button.icon;
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  button.isActive ? 'bg-gray-800' : '',
                  'h-8 w-8 p-0 hover:bg-gray-800 focus:bg-gray-200',
                )}
                onClick={button.action}
                disabled={button.disabled}
                title={button.tooltip}
              >
                {Icon && (
                  <Icon strokeWidth={2.5} className="h-4 w-4 text-white" />
                )}
              </Button>
            );
          })}
        </div>

        <div className="ProseMirror prose prose-sm prose-strong:font-extrabold prose-strong:text-white prose-headings:text-white prose-headings:font-bold prose-ul:pl-6 prose-li:my-1 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-white prose-hr:border-t-2 prose-hr:border-gray-200 prose-p:my-2 prose-mark:bg-yellow-400 prose-mark:px-1 prose-mark:rounded-sm prose-em:italic prose-u:underline text-white focus:outline-none">
          <label className="sr-only">{label}</label>
          <EditorContent editor={editor} className="max-h-64" />
          {editor.isEmpty && (
            <div className="pointer-events-none absolute top-4 left-3 text-gray-500">
              {placeholder}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
