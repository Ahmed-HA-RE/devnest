import { APP_NAME } from '@/lib/constants/app';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Sign in to your ${APP_NAME} account and access your developer knowledge hub.`,
};

const SignInPage = () => {
  return <h1>Sign In</h1>;
};

export default SignInPage;
