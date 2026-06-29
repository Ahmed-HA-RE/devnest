'use client';

import { useState } from 'react';
import Editor, { type OnChange } from '@monaco-editor/react';
import { useTheme } from '@teispace/next-themes';
import type { IconType } from 'react-icons';
import { FaCheck, FaCode, FaRegCopy } from 'react-icons/fa6';
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiDotnet,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiMarkdown,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiRuby,
  SiRust,
  SiShell,
  SiSwift,
  SiTypescript,
  SiYaml,
} from 'react-icons/si';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LANGUAGE_ICONS: Record<string, IconType> = {
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  python: SiPython,
  py: SiPython,
  go: SiGo,
  golang: SiGo,
  rust: SiRust,
  rs: SiRust,
  php: SiPhp,
  ruby: SiRuby,
  rb: SiRuby,
  html: SiHtml5,
  css: SiCss,
  json: SiJson,
  yaml: SiYaml,
  yml: SiYaml,
  markdown: SiMarkdown,
  md: SiMarkdown,
  bash: SiShell,
  shell: SiShell,
  sh: SiShell,
  cpp: SiCplusplus,
  'c++': SiCplusplus,
  c: SiC,
  csharp: SiDotnet,
  'c#': SiDotnet,
  swift: SiSwift,
  kotlin: SiKotlin,
  docker: SiDocker,
  dockerfile: SiDocker,
  sql: SiMysql,
  postgresql: SiPostgresql,
  graphql: SiGraphql,
};

const MONACO_LANGUAGE_IDS: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  rs: 'rust',
  rb: 'ruby',
  yml: 'yaml',
  md: 'markdown',
  sh: 'shell',
  bash: 'shell',
  'c++': 'cpp',
  'c#': 'csharp',
  dockerfile: 'dockerfile',
};

const normalizeLanguage = (language: string | null | undefined) =>
  language?.trim().toLowerCase() ?? '';

const renderLanguageIcon = (language: string | null | undefined) => {
  const Icon = LANGUAGE_ICONS[normalizeLanguage(language)] ?? FaCode;
  return <Icon className='size-4 text-muted-foreground' />;
};

const getMonacoLanguage = (language: string | null | undefined) => {
  const normalized = normalizeLanguage(language);
  return MONACO_LANGUAGE_IDS[normalized] || normalized || 'plaintext';
};

const CodeEditor = ({
  value,
  onChange,
  language,
  readOnly = false,
  className,
}: {
  value: string;
  onChange?: (value: string) => void;
  language?: string | null;
  readOnly?: boolean;
  className?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleChange: OnChange = (next) => {
    onChange?.(next ?? '');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success('Code copied to clipboard');
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
          {renderLanguageIcon(language)}
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label='Copy code'
            onClick={handleCopy}
          >
            {copied ? <FaCheck className='text-green-500' /> : <FaRegCopy />}
          </Button>
        </div>
      </div>
      <Editor
        height='400px'
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleChange}
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          readOnly,
          lineNumbers: 'on',
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          renderLineHighlight: readOnly ? 'none' : 'line',
        }}
      />
    </div>
  );
};

export default CodeEditor;