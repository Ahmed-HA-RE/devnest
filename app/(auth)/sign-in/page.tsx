import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import SignInForm from './_components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Sign in to your ${APP_NAME} account and access your developer knowledge hub.`,
};

interface SignInPageProps {
  searchParams: Promise<{ callbackURL?: string }>;
}

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/dashboard');
  }

  const { callbackURL = '/' } = await searchParams;

  return <SignInForm callbackURL={callbackURL} />;
};

export default SignInPage;
