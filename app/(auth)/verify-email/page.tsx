import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import VerifyEmailForm from './_components/verify-email-form';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: `Verify your email address to finish setting up your ${APP_NAME} account.`,
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/dashboard');
  }

  const { email } = await searchParams;

  if (!email) {
    return redirect('/sign-up');
  }

  return <VerifyEmailForm email={email} />;
};

export default VerifyEmailPage;