import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { APP_NAME, APP_URL, DELETE_ACCOUNT_CONSEQUENCES } from '@/lib/constants/app';

interface DeleteAccountProps {
  name: string;
  url: string;
}

const DeleteAccount = ({ name, url }: DeleteAccountProps) => (
  <Html>
    <Head />
    <Preview>Confirm the deletion of your {APP_NAME} account</Preview>
    <Tailwind>
      <Body className='bg-[#f4f5f7] font-sans py-10'>
        <Container className='mx-auto w-full max-w-[440px] rounded-2xl bg-white px-8 py-10'>
          <Section className='text-center'>
            <Img
              src={`${APP_URL}/svg/devnest-logo.svg`}
              alt={APP_NAME}
              width={140}
              className='mx-auto h-8 w-auto'
            />
          </Section>

          <Heading className='mt-8 text-center text-2xl font-bold text-[#0f172a]'>
            Delete your account
          </Heading>
          <Text className='text-center text-sm text-[#475569]'>
            Hi {name}, we received a request to permanently delete your{' '}
            {APP_NAME} account. If you confirm, here&apos;s what will happen:
          </Text>

          <Section className='mx-auto my-6 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-6 py-4'>
            <ul className='m-0 list-disc pl-4'>
              {DELETE_ACCOUNT_CONSEQUENCES.map((consequence) => (
                <li key={consequence} className='py-1 text-sm text-[#475569]'>
                  {consequence}
                </li>
              ))}
            </ul>
          </Section>

          <Section className='text-center'>
            <Button
              href={url}
              className='rounded-lg bg-[#dc2626] px-6 py-3 text-center text-sm font-semibold text-white'
            >
              Confirm Account Deletion
            </Button>
          </Section>

          <Text className='text-center text-xs text-[#94a3b8]'>
            This link will expire shortly. If you didn&apos;t request this,
            you can safely ignore this email — your account will not be
            deleted.
          </Text>

          <Hr className='my-8 border-[#e2e8f0]' />

          <Section className='mx-auto w-fit'>
            <Row>
              <Column className='pr-[20px]'>
                <Link href='https://www.instagram.com' target='_blank'>
                  <Img
                    src={`${APP_URL}/svg/instagram-icon.svg`}
                    alt='Instagram'
                    width={24}
                    height={24}
                  />
                </Link>
              </Column>
              <Column className='pr-[20px]'>
                <Link href='https://www.github.com' target='_blank'>
                  <Img
                    src={`${APP_URL}/svg/github-light-icon.svg`}
                    alt='Github'
                    width={24}
                    height={24}
                  />
                </Link>
              </Column>

              <Column>
                <Link href='https://www.reddit.com' target='_blank'>
                  <Img
                    src={`${APP_URL}/svg/reddit-icon.svg`}
                    alt='Reddit'
                    width={24}
                    height={24}
                  />
                </Link>
              </Column>
            </Row>
          </Section>

          <Text className='text-center text-xs text-[#94a3b8]'>
            DevNest is the second brain every developer needs — store once,
            find instantly, build faster.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

DeleteAccount.PreviewProps = {
  name: 'Ahmed',
  url: 'https://devnest.app/api/auth/delete-user/callback?token=abc123',
} satisfies DeleteAccountProps;

export default DeleteAccount;