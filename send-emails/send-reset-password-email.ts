import { resend } from '@/lib/resend';
import { APP_NAME } from '@/lib/constants/app';
import ResetPassword from '@/emails/reset-password';

interface SendResetPasswordEmailParams {
  email: string;
  otp: string;
}

export const sendResetPasswordEmail = async ({
  email,
  otp,
}: SendResetPasswordEmailParams) => {
  return resend.emails.send({
    from: `${APP_NAME} <support@${process.env.RESEND_DOMAIN}>`,
    to: email,
    subject: `${otp} is your ${APP_NAME} password reset code`,
    react: ResetPassword({ otp }),
  });
};
