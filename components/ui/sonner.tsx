'use client';

import { useTheme } from '@teispace/next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { FaInfoCircle, FaRegCheckCircle } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';
import { MdError } from 'react-icons/md';
import { IoIosWarning } from 'react-icons/io';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <FaRegCheckCircle className='size-4 text-green-500' />,
        info: <FaInfoCircle className='size-4.5 text-blue-500' />,
        warning: <IoIosWarning className='size-4.5 text-yellow-500' />,
        error: <MdError className='size-4.5 text-red-500' />,
        loading: <FaSpinner className='size-4.5 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
