import { IconType } from 'react-icons';
import {
  FiCode,
  FiFileText,
  FiFolder,
  FiImage,
  FiLink,
  FiStar,
  FiTerminal,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

// Maps the icon name stored in mock data to its react-icons component.
export const iconMap: Record<string, IconType> = {
  code: FiCode,
  sparkles: HiSparkles,
  terminal: FiTerminal,
  'file-text': FiFileText,
  folder: FiFolder,
  image: FiImage,
  link: FiLink,
  star: FiStar,
};

export const getIcon = (name: string): IconType => iconMap[name] ?? FiFolder;
