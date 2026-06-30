export const TYPE_OPTIONS = [
  { value: 'snippet', label: 'Snippet' },
  { value: 'command', label: 'Command' },
  { value: 'prompt', label: 'Prompt' },
  { value: 'note', label: 'Note' },
  { value: 'link', label: 'Link' },
  { value: 'file', label: 'File' },
  { value: 'image', label: 'Image' },
] as const;

export const CONTENT_TYPES = ['snippet', 'prompt', 'command', 'note'];
export const LANGUAGE_TYPES = ['snippet', 'command'];
export const MARKDOWN_TYPES = ['note', 'prompt'];
export const FILE_UPLOAD_TYPES = ['file', 'image'];

export const FILE_ALLOWED_EXTENSIONS: Record<string, string[]> = {
  file: ['.pdf', '.docx', '.xlsx', '.txt'],
  image: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const FILE_MAX_SIZE: Record<string, number> = {
  file: 5,
  image: 10,
};
