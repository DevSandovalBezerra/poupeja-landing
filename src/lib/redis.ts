import { createClient } from '@upstash/redis';

export const redis = createClient({
  url: import.meta.env.VITE_REDIS_URL || 'http://localhost:6379',
  token: import.meta.env.VITE_REDIS_TOKEN || '',
});

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch (error) {
    console.error('[Redis GET Error]', error);
    return null;
  }
}

export async function setCached<T>(key: string, data: T, ttlSeconds = 3600): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch (error) {
    console.error('[Redis SET Error]', error);
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('[Redis DEL Error]', error);
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('[RedisInvalidate Error]', error);
  }
}
