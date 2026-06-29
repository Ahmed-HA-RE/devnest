'use client';

import { useState } from 'react';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FaCheck, FaRegCopy } from 'react-icons/fa6';
import { SiMarkdown } from 'react-icons/si';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CONTENT_SIZE_CLASS =
  'min-h-[200px] max-h-[400px] overflow-y-auto themed-scrollbar';
const PROSE_CLASS =
  'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2';

const MarkdownLink = Link.configure({
  openOnClick: false,
  autolink: true,
  defaultProtocol: 'https',
  protocols: ['http', 'https'],
  isAllowedUri: (url, ctx) => {
    try {
      // construct URL
      const parsedUrl = url.includes(':')
        ? new URL(url)
        : new URL(`${ctx.defaultProtocol}://${url}`);

      // use default validation
      if (!ctx.defaultValidate(parsedUrl.href)) {
        return false;
      }

      // disallowed protocols
      const disallowedProtocols = ['ftp', 'file', 'mailto'];
      const protocol = parsedUrl.protocol.replace(':', '');

      if (disallowedProtocols.includes(protocol)) {
        return false;
      }

      // only allow protocols specified in ctx.protocols
      const allowedProtocols = ctx.protocols.map((p) =>
        typeof p === 'string' ? p : p.scheme,
      );

      if (!allowedProtocols.includes(protocol)) {
        return false;
      }

      // disallowed domains
      const disallowedDomains = ['example-phishing.com', 'malicious-site.net'];
      const domain = parsedUrl.hostname;

      if (disallowedDomains.includes(domain)) {
        return false;
      }

      // all checks have passed
      return true;
    } catch {
      return false;
    }
  },
  shouldAutoLink: (url) => {
    try {
      // construct URL
      const parsedUrl = url.includes(':')
        ? new URL(url)
        : new URL(`https://${url}`);

      // only auto-link if the domain is not in the disallowed list
      const disallowedDomains = [
        'example-no-autolink.com',
        'another-no-autolink.com',
      ];
      const domain = parsedUrl.hostname;

      return !disallowedDomains.includes(domain);
    } catch {
      return false;
    }
  },
});

const MarkdownEditor = ({
  value,
  onChange,
  readOnly = false,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: false }), MarkdownLink],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: cn(PROSE_CLASS, CONTENT_SIZE_CLASS) },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success('Markdown copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn('overflow-hidden rounded-md border', className)}
      data-vaul-no-drag=''
    >
      <div className='flex items-center justify-between bg-muted px-3 py-2'>
        <div className='flex gap-1.5'>
          <span className='size-3 rounded-full bg-red-500' />
          <span className='size-3 rounded-full bg-yellow-500' />
          <span className='size-3 rounded-full bg-green-500' />
        </div>
        <div className='flex items-center gap-2'>
          <SiMarkdown className='size-4 text-muted-foreground' />
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label='Copy markdown'
            onClick={handleCopy}
          >
            {copied ? <FaCheck className='text-green-500' /> : <FaRegCopy />}
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default MarkdownEditor;
