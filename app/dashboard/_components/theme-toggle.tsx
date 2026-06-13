'use client';

import { useTheme } from '@teispace/next-themes';
import { FiMoon, FiSun } from 'react-icons/fi';

import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      aria-label='Toggle theme'
    >
      <FiSun className='hidden dark:block' />
      <FiMoon className='block dark:hidden' />
    </Button>
  );
};

export default ThemeToggle;
