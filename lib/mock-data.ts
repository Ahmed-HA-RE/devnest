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
  createdAt: string;
  updatedAt: string;
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
  image?: string;
  isPro: boolean;
};

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  image: '/images/default-avatar.png',
  isPro: false,
};

export const itemTypes: ItemType[] = [
  {
    id: 'type-snippet',
    name: 'Snippets',
    icon: 'code',
    color: '#3b82f6',
    isSystem: true,
    itemCount: 24,
  },
  {
    id: 'type-prompt',
    name: 'Prompts',
    icon: 'sparkles',
    color: '#a855f7',
    isSystem: true,
    itemCount: 18,
  },
  {
    id: 'type-command',
    name: 'Commands',
    icon: 'terminal',
    color: '#22c55e',
    isSystem: true,
    itemCount: 15,
  },
  {
    id: 'type-note',
    name: 'Notes',
    icon: 'file-text',
    color: '#eab308',
    isSystem: true,
    itemCount: 12,
  },
  {
    id: 'type-file',
    name: 'Files',
    icon: 'folder',
    color: '#f97316',
    isSystem: true,
    itemCount: 5,
  },
  {
    id: 'type-image',
    name: 'Images',
    icon: 'image',
    color: '#ec4899',
    isSystem: true,
    itemCount: 3,
  },
  {
    id: 'type-url',
    name: 'Links',
    icon: 'link',
    color: '#06b6d4',
    isSystem: true,
    itemCount: 8,
  },
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
    createdAt: '2025-11-02',
    updatedAt: '2026-01-15',
  },
  {
    id: 'col-python-snippets',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    itemCount: 8,
    isFavorite: false,
    icon: 'code',
    createdAt: '2025-10-20',
    updatedAt: '2026-01-14',
  },
  {
    id: 'col-context-files',
    name: 'Context Files',
    description: 'AI context files for projects',
    itemCount: 5,
    isFavorite: true,
    color: 'purple',
    icon: 'file-text',
    createdAt: '2025-12-01',
    updatedAt: '2026-01-13',
  },
  {
    id: 'col-interview-prep',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    itemCount: 24,
    isFavorite: false,
    icon: 'folder',
    createdAt: '2025-09-10',
    updatedAt: '2026-01-10',
  },
  {
    id: 'col-git-commands',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    itemCount: 15,
    isFavorite: true,
    color: 'orange',
    icon: 'terminal',
    createdAt: '2025-08-22',
    updatedAt: '2026-01-08',
  },
  {
    id: 'col-ai-prompts',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    itemCount: 18,
    isFavorite: false,
    icon: 'sparkles',
    createdAt: '2025-07-05',
    updatedAt: '2026-01-05',
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
