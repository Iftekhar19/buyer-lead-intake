
const rateMap = new Map<string, { count: number; last: number }>();
const LIMIT = 3;
const WINDOW = 60 * 1000; 

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const record = rateMap.get(identifier);

  if (!record) {
    rateMap.set(identifier, { count: 1, last: now });
    return { allowed: true };
  }

  // reset window
  if (now - record.last > WINDOW) {
    rateMap.set(identifier, { count: 1, last: now });
    return { allowed: true };
  }

  if (record.count >= LIMIT) {
    return { allowed: false, retryAfter: WINDOW - (now - record.last) };
  }

  record.count++;
  return { allowed: true };
}
