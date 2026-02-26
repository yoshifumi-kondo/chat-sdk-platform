const WINDOW_MS = 60_000; // 1分
const MAX_REQUESTS = 30; // 1分あたりの最大リクエスト数

const requests = new Map<string, number[]>();

// 古いエントリを定期的にクリーンアップ
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requests) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      requests.delete(key);
    } else {
      requests.set(key, valid);
    }
  }
}, WINDOW_MS);

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (requests.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    requests.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  requests.set(key, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length };
}
