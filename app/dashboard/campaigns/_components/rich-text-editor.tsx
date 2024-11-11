'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
  Quote,
  LayoutTemplate,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { emailTemplates } from './email-templates';
import { cn } from '@/lib/utils';
import { useQueryState } from 'nuqs';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChangeAction: (content: string) => void;
}

export function RichTextEditor({
  content,
  onChangeAction,
}: RichTextEditorProps) {
  const [draftContent, setDraftContent] = useQueryState('draft', {
    history: 'replace',
    shallow: true,
    defaultValue: content,
  });

  const [selectedTemplate, setSelectedTemplate] = useQueryState('template', {
    history: 'replace',
    shallow: true,
  });

  const debouncedContent = useDebounce(draftContent, 1000);

  useEffect(() => {
    if (debouncedContent) {
      onChangeAction(debouncedContent);
    }
  }, [debouncedContent, onChangeAction]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start typing your email content here...',
      }),
    ],
    content: draftContent,
    onUpdate: ({ editor }) => {
      setDraftContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-4',
      },
    },
  });

  if (!editor) return null;

  const handleTemplateSelect = async (templateContent: string) => {
    await setSelectedTemplate(templateContent);
    editor.commands.setContent(templateContent);
    editor.commands.focus();
  };

  return (
    <div className='flex flex-col h-full bg-zinc-950'>
      <div className='border-b sticky top-0 z-10 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/50'>
        <div className='flex flex-wrap items-center gap-1 p-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='gap-2'>
                <LayoutTemplate className='h-4 w-4' />
                Templates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[300px]'>
              <DropdownMenuLabel>Choose a template</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(emailTemplates).map(([key, template]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleTemplateSelect(template.content)}
                  className='gap-2'
                  data-active={selectedTemplate === key}
                >
                  <div>
                    <p className='font-medium'>{template.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {template.content.slice(0, 50)}...
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='h-4 w-px bg-border mx-1' />

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
            className={cn('data-[active=true]:bg-white/10', 'hover:bg-white/5')}
          >
            <Bold className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
            className='data-[active=true]:bg-white/10'
          >
            <Italic className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            data-active={editor.isActive('heading', { level: 2 })}
            className='data-[active=true]:bg-white/10'
          >
            <Heading2 className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive('bulletList')}
            className='data-[active=true]:bg-white/10'
          >
            <List className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-active={editor.isActive('orderedList')}
            className='data-[active=true]:bg-white/10'
          >
            <ListOrdered className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            data-active={editor.isActive('blockquote')}
            className='data-[active=true]:bg-white/10'
          >
            <Quote className='h-4 w-4' />
          </Button>
          <div className='h-4 w-px bg-border mx-1' />
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} className='flex-1' />
    </div>
  );
}
