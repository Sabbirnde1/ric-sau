type Attempt = {
  count: number;
  lockoutUntil?: number;
};

// In-memory store for tracking failed login attempts
// Note: In a serverless environment (like Vercel), this state resets when the function cold-starts.
// For robust, distributed rate limiting, consider upgrading to @upstash/ratelimit with Redis.
const attempts = new Map<string, Attempt>();

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { success: boolean; resetTime?: number } {
  const attempt = attempts.get(identifier);

  if (attempt) {
    if (attempt.lockoutUntil && Date.now() < attempt.lockoutUntil) {
      return { success: false, resetTime: attempt.lockoutUntil };
    }

    // If lockout has expired, reset
    if (attempt.lockoutUntil && Date.now() >= attempt.lockoutUntil) {
      attempts.delete(identifier);
      return { success: true };
    }
  }

  return { success: true };
}

export function recordFailedAttempt(identifier: string): number {
  const attempt = attempts.get(identifier) || { count: 0 };
  attempt.count += 1;

  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  attempts.set(identifier, attempt);
  return MAX_ATTEMPTS - attempt.count; // Return remaining attempts
}

export function clearFailedAttempts(identifier: string) {
  attempts.delete(identifier);
}
