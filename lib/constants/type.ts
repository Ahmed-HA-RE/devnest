export const TYPE_OPTIONS = [
  { value: 'snippet', label: 'Snippet' },
  { value: 'command', label: 'Command' },
  { value: 'prompt', label: 'Prompt' },
  { value: 'note', label: 'Note' },
  { value: 'link', label: 'Link' },
] as const;

export const CONTENT_TYPES = ['snippet', 'prompt', 'command', 'note'];
export const LANGUAGE_TYPES = ['snippet', 'command'];
export const MARKDOWN_TYPES = ['note', 'prompt'];