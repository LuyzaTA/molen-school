import "server-only";
import { put, list, del } from "@vercel/blob";

// ============================================================
// A tiny JSON key-value store over Vercel Blob. SERVER ONLY.
//
// Security model: blobs use public access, but we make the URLs
// unguessable (addRandomSuffix) and NEVER return the URL or the
// BLOB_READ_WRITE_TOKEN to the client. All reads/writes happen
// here, server-side, found by prefix via the token-authed list().
//
// NOTE: Blob is object storage, not a database. For production PII
// (CPF/RG/address) prefer Vercel Postgres/Neon. This is a working v1.
// ============================================================

function matches(pathname: string, key: string): boolean {
  return pathname === key || pathname.startsWith(key + "-");
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const { blobs } = await list({ prefix: key, limit: 100 });
  const blob = blobs.find((b) => matches(b.pathname, key));
  if (!blob) return null;
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function kvExists(key: string): Promise<boolean> {
  const { blobs } = await list({ prefix: key, limit: 100 });
  return blobs.some((b) => matches(b.pathname, key));
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  // Remove any prior copy first so a key maps to exactly one blob.
  await kvDelete(key);
  await put(key, JSON.stringify(value), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

export async function kvDelete(key: string): Promise<void> {
  const { blobs } = await list({ prefix: key, limit: 100 });
  const urls = blobs.filter((b) => matches(b.pathname, key)).map((b) => b.url);
  if (urls.length) await del(urls);
}