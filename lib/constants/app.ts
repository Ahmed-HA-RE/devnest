export const APP_NAME = 'DevNest';
export const APP_DESCRIPTION =
  'DevNest is a centralized developer workspace for storing commands, documentation, code snippets, notes, images, links, and technical resources in one searchable, organized hub.';
export const APP_URL =
  process.env.NEXT_PUBLIC_PROD_URL || 'http://localhost:3000';

// OAUTH PROVIDERS
export const OAUTH_PROVIDERS = ['github', 'google'];

// DELETE ACCOUNT CONSEQUENCES
export const DELETE_ACCOUNT_CONSEQUENCES = [
  'All your items (snippets, commands, notes, files, prompts, images, links) will be permanently deleted.',
  'All your collections will be permanently deleted.',
  'All your tags will be permanently deleted.',
  'This action cannot be undone.',
];
