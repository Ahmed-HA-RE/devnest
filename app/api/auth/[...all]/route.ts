import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { type NextRequest, NextResponse } from 'next/server';
import { getClientIp } from 'next-request-ip';
import { AUTH_RATE_LIMITS, rateLimit } from '@/lib/rate-limit';

const { POST: authPost, GET } = toNextJsHandler(auth);

export const POST = async (request: NextRequest) => {
  const path = request.nextUrl.pathname.replace('/api/auth', '');
  const config = AUTH_RATE_LIMITS[path];

  if (config) {
    const ip = getClientIp(request.headers) ?? 'unknown';
    let identifier = ip;

    if (config.useEmail) {
      const body = await request
        .clone()
        .json()
        .catch(() => null);
      if (body?.email) identifier = `${ip}:${body.email}`;
    }

    const { success } = await rateLimit({
      prefix: path,
      identifier,
      requests: config.requests,
      window: config.window,
    });

    if (!success) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }
  }

  return authPost(request);
};

export { GET };
