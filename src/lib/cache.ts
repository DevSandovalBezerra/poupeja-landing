const USE_REDIS = import.meta.env.VITE_USE_REDIS === 'true';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export async function getFromCache<T>(key: string): Promise<T | null> {
  if (USE_REDIS) {
    const { getCached: redisGet } = await import('./redis');
    const cached = await redisGet<CacheItem<T>>(key);
    if (cached && Date.now() - cached.timestamp < ((cached.data as unknown as { expiresAt?: number }).expiresAt ?? Infinity)) {
      return cached.data;
    }
    return null;
  }

  const stored = localStorage.getItem(key);
  if (!stored) return null;

  try {
    const item: CacheItem<T> = JSON.parse(stored);
    if (Date.now() - item.timestamp < ((item.data as unknown as { expiresAt?: number }).expiresAt ?? Infinity)) {
      return item.data;
    }
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

export async function setToCache<T>(key: string, data: T, ttlSeconds = 3600): Promise<void> {
  const item: CacheItem<T> = { data, timestamp: Date.now() };

  if (USE_REDIS) {
    const { setCached: redisSet } = await import('./redis');
    await redisSet(key, item, ttlSeconds);
  } else {
    localStorage.setItem(key, JSON.stringify(item));
  }
}

export async function invalidateCache(key: string): Promise<void> {
  if (USE_REDIS) {
    const { deleteCached } = await import('./redis');
    await deleteCached(key);
  } else {
    localStorage.removeItem(key);
  }
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (USE_REDIS) {
    const { invalidatePattern } = await import('./redis');
    await invalidatePattern(pattern);
  } else {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(pattern.replace('*', '')));
    keys.forEach(k => localStorage.removeItem(k));
  }
}

// Synchronous localStorage helpers (used without await)
export function getCached<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const item: CacheItem<T> = JSON.parse(stored);
    const expiresAt = (item.data as unknown as { expiresAt?: number }).expiresAt ?? Infinity;
    if (Date.now() - item.timestamp < expiresAt) return item.data;
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T, _ttlSeconds = 3600): void {
  const item: CacheItem<T> = { data, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(item));
}

// Async cache facade used by gemini.ts
export const cache = {
  get: getFromCache,
  set: setToCache,
};
