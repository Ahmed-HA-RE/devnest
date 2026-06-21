'use client';

import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const AuthProviders: React.FC = () => {
  const buttonClassName =
    "dark:bg-transparent text-sm [&_svg:not([class*='size-'])]:size-5 flex-1 max-w-[220px]";

  return (
    <div className='flex items-center justify-center gap-4'>
      <Button
        variant='outline'
        size='lg'
        type='button'
        className={buttonClassName}
      >
        <FiGithub />
        GitHub
      </Button>
      <Button
        variant='outline'
        size='lg'
        type='button'
        className={buttonClassName}
      >
        <FcGoogle />
        Google
      </Button>
    </div>
  );
};

export default AuthProviders;
