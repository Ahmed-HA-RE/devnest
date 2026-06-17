import { IconType } from 'react-icons';
import { FaTerminal, FaCode } from 'react-icons/fa6';
import {
  FaFileAlt,
  FaRegFolderOpen,
  FaFileImage,
  FaRegStickyNote,
} from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import { LuLink } from 'react-icons/lu';

// Maps the icon name stored in mock data to its react-icons component.
export const iconMap: Record<string, IconType> = {
  snippet: FaCode,
  prompt: IoSparkles,
  command: FaTerminal,
  note: FaRegStickyNote,
  file: FaFileAlt,
  image: FaFileImage,
  link: LuLink,
};

export const getIcon = (name: string): IconType =>
  iconMap[name] ?? FaRegFolderOpen;
