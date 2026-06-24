import { Button } from '@/components/ui/button';
import Error02Illustration from '@/public/svg/error-02-illustration';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-12 px-8 py-8 sm:py-16 lg:gap-24 lg:py-24'>
      <Error02Illustration className='h-[clamp(300px,50vh,500px)] max-sm:h-75' />

      <div className='text-center'>
        <h3 className='mb-6 text-5xl font-semibold'>Oops!</h3>
        <h4 className='mb-1.5 text-3xl font-semibold'>Something went wrong</h4>
        <p className='mb-6'>
          The page you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <Button size='lg' asChild>
          <Link href='/'>Back to home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
