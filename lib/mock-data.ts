// Mock data for the dashboard UI until the database is wired up.

export type ItemType = {
  id: string;
  name: string;
  icon: string;
  color?: string;
  isSystem: boolean;
  itemCount: number;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  color?: string;
  icon: string;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  contentType: 'text' | 'file';
  content?: string;
  language?: string;
  typeId: string;
  collectionId: string | null;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro: boolean;
};

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  isPro: false,
};

export const itemTypes: ItemType[] = [
  {
    id: 'type-snippet',
    name: 'Snippets',
    icon: 'code',
    isSystem: true,
    itemCount: 24,
  },
  {
    id: 'type-prompt',
    name: 'Prompts',
    icon: 'sparkles',
    isSystem: true,
    itemCount: 18,
  },
  {
    id: 'type-command',
    name: 'Commands',
    icon: 'terminal',
    isSystem: true,
    itemCount: 15,
  },
  {
    id: 'type-note',
    name: 'Notes',
    icon: 'file-text',
    isSystem: true,
    itemCount: 12,
  },
  {
    id: 'type-file',
    name: 'Files',
    icon: 'folder',
    isSystem: true,
    itemCount: 5,
  },
  {
    id: 'type-image',
    name: 'Images',
    icon: 'image',
    isSystem: true,
    itemCount: 3,
  },
  { id: 'type-url', name: 'Links', icon: 'link', isSystem: true, itemCount: 8 },
];

export const collections: Collection[] = [
  {
    id: 'col-react-patterns',
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    itemCount: 12,
    isFavorite: true,
    color: 'yellow',
    icon: 'star',
  },
  {
    id: 'col-python-snippets',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    itemCount: 8,
    isFavorite: false,
    icon: 'code',
  },
  {
    id: 'col-context-files',
    name: 'Context Files',
    description: 'AI context files for projects',
    itemCount: 5,
    isFavorite: true,
    color: 'purple',
    icon: 'file-text',
  },
  {
    id: 'col-interview-prep',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    itemCount: 24,
    isFavorite: false,
    icon: 'folder',
  },
  {
    id: 'col-git-commands',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    itemCount: 15,
    isFavorite: true,
    color: 'orange',
    icon: 'terminal',
  },
  {
    id: 'col-ai-prompts',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    itemCount: 18,
    isFavorite: false,
    icon: 'sparkles',
  },
];

export const items: Item[] = [
  {
    id: 'item-use-auth-hook',
    title: 'useAuth Hook',
    description: 'Custom authentication hook for React applications',
    contentType: 'text',
    content: 'export function useAuth() {\n  // ...\n}',
    language: 'typescript',
    typeId: 'type-snippet',
    collectionId: 'col-react-patterns',
    tags: ['react', 'auth', 'hooks'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
  },
  {
    id: 'item-api-error-handling',
    title: 'API Error Handling Pattern',
    description: 'Fetch wrapper with exponential backoff retry logic',
    contentType: 'text',
    content: 'async function fetchWithRetry(url: string) {\n  // ...\n}',
    language: 'typescript',
    typeId: 'type-snippet',
    collectionId: 'col-react-patterns',
    tags: ['fetch', 'error-handling', 'retry'],
    isFavorite: false,
    isPinned: true,
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
  },
];
