import { api, type Document } from "./api";

const BATCH_SIZE = 4;
const BATCH_DELAY_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function scheduleIdle(cb: () => void): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(cb, { timeout: 5000 });
  } else {
    setTimeout(cb, 100);
  }
}

/**
 * Proactively fetches the content of every document so the service worker
 * caches them all. Runs in small idle batches to avoid blocking the UI or
 * hammering the server. Bails out immediately if the browser goes offline.
 */
export async function prefetchDocuments(documents: Document[]): Promise<void> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !navigator.onLine
  ) {
    return;
  }

  // Only prefetch file entries, not folders
  const files = documents.filter((d) => d.type === "file");

  if (files.length === 0) return;

  // Check which files are already cached to avoid redundant network hits
  const cache = await caches.open("doc-content").catch(() => null);

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    if (!navigator.onLine) break;

    const batch = files.slice(i, i + BATCH_SIZE);

    await new Promise<void>((resolve) => {
      scheduleIdle(async () => {
        await Promise.allSettled(
          batch.map(async (doc) => {
            if (!navigator.onLine) return;
            // Skip if already cached (avoid re-fetching on every app load)
            if (cache) {
              const url = `${window.location.origin}/api/documents/content?path=${encodeURIComponent(doc.path)}`;
              const cached = await cache.match(url);
              if (cached) return;
            }
            // Fetching via the API client goes through the SW, which caches it
            await api.getDocument(doc.path).catch(() => undefined);
          }),
        );
        resolve();
      });
    });

    // Small delay between batches so we don't saturate the connection
    if (i + BATCH_SIZE < files.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }
}
