import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ResetPasswordForm from './_components/reset-password-form';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: `Enter the code sent to your email to reset your ${APP_NAME} password.`,
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { email } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!email) {
    return redirect('/forgot-password');
  }

  return <ResetPasswordForm email={email} isUserLoggedIn={!!session} />;
};

export default ResetPasswordPage;
