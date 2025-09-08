import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Link as LinkIcon,
} from 'lucide-react';
import './index.css';
import { useState } from 'react';
import { Toggle } from '../ui/toggle';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const MenuButton = ({
  onPressedChange,
  children,
}: {
  onPressedChange: (pressed: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <Toggle type='button' onPressedChange={onPressedChange}>
      {children}
    </Toggle>
  );
};

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            'text-blue-600 underline hover:text-blue-700 transition-colors',
        },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-sm max-w-none p-3 min-h-[180px] border rounded-md focus:outline-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <>
      <div className='space-y-2'>
        <div className='flex items-center gap-2 flex-wrap border rounded-lg p-2'>
          <MenuButton
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() => editor.chain().focus().undo().run()}
          >
            <Undo2 size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() => editor.chain().focus().redo().run()}
          >
            <Redo2 size={16} />
          </MenuButton>

          <MenuButton
            onPressedChange={() => {
              setLinkDialogOpen(true);
            }}
          >
            <LinkIcon size={16} />
          </MenuButton>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4'>
            <Input
              id='link'
              name='link'
              placeholder='https://example.com'
              onChange={(e) => {
                setLinkUrl(e.target.value);
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              type='submit'
              onClick={() => {
                if (linkUrl) {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: linkUrl })
                    .run();

                  setLinkUrl('');
                  setLinkDialogOpen(false);
                }
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
