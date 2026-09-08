'use client';

import { useEffect } from 'react';
import { cn } from '@/utils/tw-merge';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlignExtension from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Highlighter,
  Italic,
  List,
  Underline as UnderlineIcon,
  type LucideIcon,
} from 'lucide-react';

const TextAlign = TextAlignExtension as Extension;

type PhaseNotesEditorProps = {
  phaseId: string;
  content: string;
  onChange: (html: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
};

export function PhaseNotesEditor({
  phaseId,
  content,
  onChange,
  onEditStart,
  onEditEnd,
}: PhaseNotesEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder:
          "What's the read here? Where does everyone go, and what if the defense switches?",
      }),
    ],
    content,
    onFocus: onEditStart,
    onBlur: onEditEnd,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[16rem] px-1 py-3 focus:outline-none prose-p:my-2 prose-ul:my-2 prose-mark:rounded-sm prose-mark:bg-amber-200/70 prose-mark:px-0.5',
      },
    },
  });

  // Tiptap is uncontrolled after init — reload when the selected phase changes.
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(content || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseId, editor]);

  if (!editor) return null;

  const items: (
    | 'sep'
    | { icon: LucideIcon; label: string; run: () => void; active: boolean }
  )[] = [
    {
      icon: Bold,
      label: 'Bold',
      run: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      run: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
    },
    {
      icon: UnderlineIcon,
      label: 'Underline',
      run: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive('underline'),
    },
    'sep',
    {
      icon: Highlighter,
      label: 'Highlight',
      run: () => editor.chain().focus().toggleHighlight().run(),
      active: editor.isActive('highlight'),
    },
    {
      icon: List,
      label: 'Bullet list',
      run: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    'sep',
    {
      icon: AlignLeft,
      label: 'Align left',
      run: () => editor.chain().focus().setTextAlign('left').run(),
      active: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: AlignCenter,
      label: 'Align center',
      run: () => editor.chain().focus().setTextAlign('center').run(),
      active: editor.isActive({ textAlign: 'center' }),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex items-center gap-0.5 border-b border-black/10 pb-1.5"
      >
        {items.map((item, i) =>
          item === 'sep' ? (
            <div key={i} className="mx-1.5 h-5 w-px bg-black/10" />
          ) : (
            <button
              key={i}
              type="button"
              aria-label={item.label}
              aria-pressed={item.active}
              title={item.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={item.run}
              className={cn(
                'cursor-pointer rounded p-1.5 text-slate-600 transition hover:bg-black/5',
                item.active && 'bg-black/10 text-slate-900',
              )}
            >
              <item.icon className="h-4 w-4" />
            </button>
          ),
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
