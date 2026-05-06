type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 30_000;

function getStorageKey(key: string) {
  return `ai-video-cache:${key}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function setApiCache<T>(key: string, value: T, ttl = DEFAULT_TTL) {
  const entry: CacheEntry<T> = {
    expiresAt: Date.now() + ttl,
    value,
  };

  memoryCache.set(key, entry);

  if (canUseStorage()) {
    window.localStorage.setItem(getStorageKey(key), JSON.stringify(entry));
  }
}

export function getApiCache<T>(key: string): T | null {
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return memoryEntry.value;
  }

  if (!canUseStorage()) {
    return null;
  }

  const rawEntry = window.localStorage.getItem(getStorageKey(key));
  if (!rawEntry) {
    return null;
  }

  try {
    const storageEntry = JSON.parse(rawEntry) as CacheEntry<T>;
    if (storageEntry.expiresAt <= Date.now()) {
      window.localStorage.removeItem(getStorageKey(key));
      return null;
    }

    memoryCache.set(key, storageEntry);
    return storageEntry.value;
  } catch {
    window.localStorage.removeItem(getStorageKey(key));
    return null;
  }
}

export function invalidateApiCache(key?: string) {
  if (!key) {
    memoryCache.clear();
    if (canUseStorage()) {
      Object.keys(window.localStorage)
        .filter((itemKey) => itemKey.startsWith("ai-video-cache:"))
        .forEach((itemKey) => window.localStorage.removeItem(itemKey));
    }
    return;
  }

  memoryCache.delete(key);
  if (canUseStorage()) {
    window.localStorage.removeItem(getStorageKey(key));
  }
}

export async function cachedApiGet<T>(key: string, url: string, ttl = DEFAULT_TTL) {
  const cachedValue = getApiCache<T>(key);
  if (cachedValue) {
    return cachedValue;
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { data: T };
  setApiCache(key, payload.data, ttl);
  return payload.data;
}
