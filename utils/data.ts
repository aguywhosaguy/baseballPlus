import { storage } from '#imports';

export const DATA_URL =
  'https://github.com/aguywhosaguy/chadwickCharts/releases/download/latest/data.json';

const SUPPORTED_SCHEMA = 1;
const STALE_AFTER_MS = 20 * 60 * 60 * 1000;

export interface DataFile {
  schemaVersion: number;
  generatedAt: string;
  upstreamCommit: string;
  pairs: [string, string][];
}

export interface Maps {
  fgToBb: Map<string, string>;
  bbToFg: Map<string, string>;
}

const storedData = storage.defineItem<DataFile | null>('local:data', {
  fallback: null,
});
const storedEtag = storage.defineItem<string | null>('local:dataEtag', {
  fallback: null,
});
const lastChecked = storage.defineItem<number>('local:dataLastChecked', {
  fallback: 0,
});

function isValid(d: any): d is DataFile {
  return (
    d &&
    d.schemaVersion === SUPPORTED_SCHEMA &&
    Array.isArray(d.pairs) &&
    d.pairs.length > 0 &&
    typeof d.generatedAt === 'string' &&
    typeof d.upstreamCommit === 'string'
  );
}

async function loadBundled(): Promise<DataFile> {
  const res = await fetch(browser.runtime.getURL('/data.json' as any));
  return res.json();
}

function buildMaps(d: DataFile): Maps {
  const fgToBb = new Map<string, string>();
  const bbToFg = new Map<string, string>();
  for (const [fg, bb] of d.pairs) {
    fgToBb.set(fg, bb);
    bbToFg.set(bb, fg);
  }
  return { fgToBb, bbToFg };
}

let cache: Maps | null = null;
// Rebuild the maps in this context whenever the stored data changes.
storedData.watch(() => {
  cache = null;
});

/** Used by content scripts and the background. Never touches the network. */
export async function getMaps(): Promise<Maps> {
  if (cache) return cache;
  const data = (await storedData.getValue()) ?? (await loadBundled());
  cache = buildMaps(data);
  return cache;
}

export async function seedFromBundled(): Promise<void> {
  try {
    const bundled = await loadBundled();
    if (!isValid(bundled)) return;
    const current = await storedData.getValue();
    if (!current || bundled.generatedAt > current.generatedAt) {
      await storedData.setValue(bundled);
      await storedEtag.setValue(null);
    }
  } catch {
  }
}

export async function refreshData(): Promise<void> {
  const etag = await storedEtag.getValue();

  let res: Response;
  try {
    res = await fetch(DATA_URL, {
      headers: etag ? { 'If-None-Match': etag } : {},
    });
  } catch {
    return; // offline or blocked: try again at the next check
  }

  await lastChecked.setValue(Date.now());
  if (res.status === 304 || !res.ok) return;

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return;
  }
  if (!isValid(data)) return;

  const current = await storedData.getValue();

  // Same upstream data (e.g. ETag wasn't honored through the redirect): don't rewrite.
  if (current && current.upstreamCommit === data.upstreamCommit) {
    await storedEtag.setValue(res.headers.get('etag'));
    return;
  }

  // Refuse a suspiciously smaller file; keep the known-good copy.
  if (current && data.pairs.length < current.pairs.length * 0.8) return;

  await storedData.setValue(data);
  await storedEtag.setValue(res.headers.get('etag'));
}

/** For browser startup: only hit the network if the last check was a while ago. */
export async function refreshIfStale(): Promise<void> {
  const last = await lastChecked.getValue();
  if (Date.now() - last > STALE_AFTER_MS) await refreshData();
}
