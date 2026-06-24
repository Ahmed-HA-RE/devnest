import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ResetPasswordForm from './_components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: `Enter the code sent to your email to reset your ${APP_NAME} password.`,
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { email } = await searchParams;

  if (!email) {
    return redirect('/forgot-password');
  }

  return <ResetPasswordForm email={email} />;
};

export default ResetPasswordPage;