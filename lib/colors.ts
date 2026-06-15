import type { CSSProperties } from 'react';

// Maps named colors (as stored in the database) to Tailwind utility classes.
const textColorMap: Record<string, string> = {
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  pink: 'text-pink-500',
  red: 'text-red-500',
};

const borderColorMap: Record<string, string> = {
  yellow: 'border-l-yellow-500',
  purple: 'border-l-purple-500',
  orange: 'border-l-orange-500',
  blue: 'border-l-blue-500',
  green: 'border-l-green-500',
  pink: 'border-l-pink-500',
  red: 'border-l-red-500',
};

const isHexColor = (color: string) => color.startsWith('#');

// Colors are stored as either a named color (e.g. "yellow") or a hex
// value (e.g. "#3b82f6"). Named colors map to Tailwind classes; hex
// values are applied as inline styles.
export function getTextColor(color?: string): {
  className?: string;
  style?: CSSProperties;
} {
  if (!color) return {};
  if (isHexColor(color)) return { style: { color } };
  return { className: textColorMap[color] };
}

export function getBorderColor(color?: string): {
  className?: string;
  style?: CSSProperties;
} {
  if (!color) return { className: 'border-l-border' };
  if (isHexColor(color)) return { style: { borderLeftColor: color } };
  return { className: borderColorMap[color] ?? 'border-l-border' };
}
