import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FaArrowRightLong } from 'react-icons/fa6';

import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import AuthCarousel from './_components/auth-carousel';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen justify-center py-14'>
      <div className='relative grid w-full max-w-[95%] self-center overflow-hidden rounded-4xl bg-background p-4 max-xl:py-6 shadow-xl backdrop-blur-sm lg:self-stretch lg:grid-cols-2'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -top-40 -right-40 size-96 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-chart-3/10 blur-3xl dark:bg-chart-3/20'
        />

        <div className='relative hidden overflow-hidden rounded-3xl lg:block'>
          <div className='absolute inset-x-6 top-6 z-10 flex items-center justify-between'>
            <Image
              src='/svg/devnest-logo.svg'
              alt='DevNest'
              width={460}
              height={120}
              priority
              className='h-10 w-auto'
            />

            <Badge
              asChild
              variant='secondary'
              className='h-8 gap-1.5 rounded-full bg-background/90 px-4 text-sm font-medium backdrop-blur-sm hover:bg-background'
            >
              <Link href='/'>
                Back to home
                <FaArrowRightLong className='size-3.5' />
              </Link>
            </Badge>
          </div>

          <AuthCarousel />
        </div>

        <div className='flex flex-col items-center justify-center lg:p-8'>
          {/* Auth forms render here — implemented in the next feature */}
          <div className='w-full lg:max-w-xl'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
