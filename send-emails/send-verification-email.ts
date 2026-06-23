import { resend } from '@/lib/resend';
import { APP_NAME } from '@/lib/constants/app';
import VerifyEmail from '@/emails/verify-email';

interface SendVerificationEmailParams {
  email: string;
  otp: string;
}

export const sendVerificationEmail = async ({
  email,
  otp,
}: SendVerificationEmailParams) => {
  return resend.emails.send({
    from: `${APP_NAME} <verify@${process.env.RESEND_DOMAIN}>`,
    to: email,
    subject: `${otp} is your ${APP_NAME} verification code`,
    react: VerifyEmail({ otp }),
  });
};
