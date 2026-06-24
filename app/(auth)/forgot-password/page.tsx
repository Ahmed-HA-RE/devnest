import { auth } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ForgotPasswordForm from './_components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: `Enter your email and we will send you a code to reset your ${APP_NAME} password.`,
};

const ForgotPasswordPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect('/dashboard');
  }

  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;