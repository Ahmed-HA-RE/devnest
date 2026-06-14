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
    createdAt: '2025-11-02',
    updatedAt: '2026-01-15',
  },
  {
    id: 'col-python-snippets',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    itemCount: 8,
    isFavorite: false,
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

    createdAt: '2025-12-01',
    updatedAt: '2026-01-13',
  },
  {
    id: 'col-interview-prep',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    itemCount: 24,
    isFavorite: false,
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
    createdAt: '2025-08-22',
    updatedAt: '2026-01-08',
  },
  {
    id: 'col-ai-prompts',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    itemCount: 18,
    isFavorite: false,
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
  {
    id: 'item-code-review-prompt',
    title: 'Code Review Prompt',
    description: 'Prompt template for thorough AI-assisted code reviews',
    contentType: 'text',
    content: 'Review the following code for bugs, readability...',
    typeId: 'type-prompt',
    collectionId: 'col-ai-prompts',
    tags: ['ai', 'review', 'prompt'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
  },
  {
    id: 'item-git-rebase-cheatsheet',
    title: 'Git Rebase Cheatsheet',
    description: 'Common interactive rebase commands and recovery tips',
    contentType: 'text',
    content: 'git rebase -i HEAD~3',
    language: 'bash',
    typeId: 'type-command',
    collectionId: 'col-git-commands',
    tags: ['git', 'rebase'],
    isFavorite: false,
    isPinned: true,
    createdAt: '2026-01-19',
    updatedAt: '2026-01-19',
  },
  {
    id: 'item-interview-bigO-notes',
    title: 'Big O Notation Notes',
    description: 'Quick reference for time and space complexity analysis',
    contentType: 'text',
    content: '# Big O Notation\n\n- O(1): constant...',
    typeId: 'type-note',
    collectionId: 'col-interview-prep',
    tags: ['algorithms', 'interview'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
  },
  {
    id: 'item-react-context-file',
    title: 'React Project Context',
    description: 'AI context file describing the React project structure',
    contentType: 'file',
    typeId: 'type-file',
    collectionId: 'col-context-files',
    tags: ['react', 'context', 'ai'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2026-01-16',
    updatedAt: '2026-01-16',
  },
  {
    id: 'item-python-decorator',
    title: 'Timing Decorator',
    description: 'Python decorator that logs function execution time',
    contentType: 'text',
    content: 'def timed(func):\n    # ...\n    return wrapper',
    language: 'python',
    typeId: 'type-snippet',
    collectionId: 'col-python-snippets',
    tags: ['python', 'decorator', 'performance'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-14',
    updatedAt: '2026-01-14',
  },
  {
    id: 'item-design-mockup',
    title: 'Dashboard Mockup',
    description: 'Reference image for the dashboard layout design',
    contentType: 'file',
    typeId: 'type-image',
    collectionId: null,
    tags: ['design', 'ui'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-11',
    updatedAt: '2026-01-11',
  },
  {
    id: 'item-useful-docs-link',
    title: 'MDN Fetch API Docs',
    description: 'Reference link for the Fetch API documentation',
    contentType: 'text',
    content: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
    typeId: 'type-url',
    collectionId: null,
    tags: ['reference', 'docs'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-10',
  },
  {
    id: 'item-debounce-hook',
    title: 'useDebounce Hook',
    description: 'Debounce rapidly changing values in React',
    contentType: 'text',
    content: 'export function useDebounce(value, delay) {\n  // ...\n}',
    language: 'typescript',
    typeId: 'type-snippet',
    collectionId: 'col-react-patterns',
    tags: ['react', 'hooks', 'performance'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-09',
    updatedAt: '2026-01-09',
  },
  {
    id: 'item-sql-query-helper',
    title: 'SQL Query Builder Helper',
    description: 'Small helper for composing parameterized SQL queries',
    contentType: 'text',
    content: 'def build_query(table, filters):\n    # ...',
    language: 'python',
    typeId: 'type-snippet',
    collectionId: 'col-python-snippets',
    tags: ['python', 'sql'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-01-08',
    updatedAt: '2026-01-08',
  },
];
