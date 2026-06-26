import { resend } from '@/lib/resend';
import { APP_NAME } from '@/lib/constants/app';
import DeleteAccount from '@/emails/delete-account';

interface SendDeleteAccountEmailParams {
  email: string;
  name: string;
  url: string;
}

export const sendDeleteAccountEmail = async ({
  email,
  name,
  url,
}: SendDeleteAccountEmailParams) => {
  return resend.emails.send({
    from: `${APP_NAME} <support@${process.env.RESEND_DOMAIN}>`,
    to: email,
    subject: `Confirm deletion of your ${APP_NAME} account`,
    react: DeleteAccount({ name, url }),
  });
};