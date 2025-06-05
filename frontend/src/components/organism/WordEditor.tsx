import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Strikethrough, Heading1, Heading2, Save, Download } from 'lucide-react'
import { Button } from "@/components/ui/button";

interface WordEditorProps {
  onSave?: () => void;
  onDownload?: () => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-input p-2 flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-accent' : ''}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}

const WordEditor: React.FC<WordEditorProps> = ({
  onSave,
  onDownload
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {},
        orderedList: {},
        heading: {
          levels: [1, 2]
        }
      })
    ],
    content: '<p>Start writing your proposal here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
      }
    }
  })

  return (
    <div className="border border-input rounded-lg flex-1 h-full">
      <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="text-lg text-foreground font-semibold">Editor</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave} startIcon={<Save />}>Save & Close</Button>
          <Button onClick={onDownload} startIcon={<Download />}>Download</Button>
        </div>
      </div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default WordEditor;
