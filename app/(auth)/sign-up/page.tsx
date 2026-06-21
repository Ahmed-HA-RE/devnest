import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from './_components/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create your DevNest account and start organizing your developer knowledge.',
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackURL?: string }>;
}

const SignUpPage = async ({ searchParams }: SignUpPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/dashboard');
  }

  const { callbackURL = '/' } = await searchParams;

  return <SignUpForm callbackURL={callbackURL} />;
};

export default SignUpPage;
