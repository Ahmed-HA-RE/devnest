import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const limiters = new Map<string, Ratelimit>();

interface RateLimitOptions {
  prefix: string;
  identifier: string;
  requests: number;
  window: Duration;
}

const getLimiter = (prefix: string, requests: number, window: Duration) => {
  const cacheKey = `${prefix}:${requests}:${window}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ratelimit:${prefix}`,
  });
  limiters.set(cacheKey, limiter);

  return limiter;
};

export const rateLimit = ({
  prefix,
  identifier,
  requests,
  window,
}: RateLimitOptions) => {
  return getLimiter(prefix, requests, window).limit(identifier);
};

interface AuthRouteRateLimit {
  requests: number;
  window: Duration;
  useEmail?: boolean;
}

export const AUTH_RATE_LIMITS: Record<string, AuthRouteRateLimit> = {
  '/sign-up/email': { requests: 5, window: '10 s' },
  '/sign-in/email': { requests: 5, window: '10 s', useEmail: true },
  '/email-otp/request-password-reset': { requests: 10, window: '10 s' },
  '/email-otp/check-verification-otp': { requests: 5, window: '5 s' },
  '/email-otp/send-verification-otp': { requests: 5, window: '5 s' },
  '/email-otp/verify-email': { requests: 5, window: '10 s' },
};
