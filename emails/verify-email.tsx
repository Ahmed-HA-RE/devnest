import {
  Body,
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
import { APP_NAME, APP_URL } from '@/lib/constants/app';

interface VerifyEmailProps {
  otp: string;
}

const VerifyEmail = ({ otp }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Your {APP_NAME} verification code is {otp}
    </Preview>
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
            Verify your email
          </Heading>
          <Text className='text-center text-sm text-[#475569]'>
            Thanks for creating your {APP_NAME} account. Enter the code below to
            verify your email address.
          </Text>

          <Section className='mx-auto my-6 w-fit rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-8 py-4 text-center'>
            <Text className='m-0 text-3xl font-bold tracking-[0.4em] text-[#2563eb]'>
              {otp}
            </Text>
          </Section>

          <Text className='text-center text-xs text-[#94a3b8]'>
            This code will expire in 10 minutes. If you didn&apos;t request this
            code, you can safely ignore this email.
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
            DevNest is the second brain every developer needs — store once, find
            instantly, build faster.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

VerifyEmail.PreviewProps = {
  otp: '123456',
} satisfies VerifyEmailProps;

export default VerifyEmail;
