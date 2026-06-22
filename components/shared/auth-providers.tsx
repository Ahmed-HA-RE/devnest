'use client';

import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { OAUTH_PROVIDERS } from '@/lib/constants/app';
import { Spinner } from '../ui/spinner';

const AuthProviders = ({ callbackURL }: { callbackURL: string }) => {
  const buttonClassName =
    "dark:bg-transparent text-sm [&_svg:not([class*='size-'])]:size-5 flex-1 max-w-[220px]";

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const providerIcons: Record<string, React.ReactNode> = {
    github: <FiGithub />,
    google: <FcGoogle />,
  };

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider);
    startTransition(async () => {
      try {
        const { data, error } = await authClient.signIn.social({
          provider,
          callbackURL,
        });
        if (data && data?.url) {
          router.push(data.url);
        } else {
          throw new Error(error?.message || 'An unknown error occurred');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoadingProvider(null);
      }
    });
  };

  return (
    <div className='flex items-center justify-center gap-4'>
      {OAUTH_PROVIDERS.map((provider) => (
        <Button
          variant='outline'
          key={provider}
          size='lg'
          type='button'
          className={buttonClassName}
          onClick={() => handleSocialLogin(provider)}
          disabled={isPending}
        >
          {loadingProvider === provider ? (
            <Spinner />
          ) : (
            <>
              {providerIcons[provider]}
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </>
          )}
        </Button>
      ))}
    </div>
  );
};

export default AuthProviders;
