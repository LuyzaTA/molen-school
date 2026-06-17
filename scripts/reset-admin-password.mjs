// One-time script: resets the admin account password.
// Run with: npx vercel env run node scripts/reset-admin-password.mjs
import { list, put, del } from "@vercel/blob";
import { scryptSync, randomBytes, createHash, createHmac } from "crypto";

const NEW_PASSWORD = "Admin@2026";
const ADMIN_USER_ID = "M516275";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function matches(pathname, key) {
  return pathname === key || pathname.startsWith(key + "-");
}

async function kvGet(key) {
  const { blobs } = await list({ prefix: key, limit: 100 });
  const blob = blobs.find((b) => matches(b.pathname, key));
  if (!blob) return null;
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

async function kvSet(key, value) {
  const { blobs } = await list({ prefix: key, limit: 100 });
  const toDelete = blobs.filter((b) => matches(b.pathname, key)).map((b) => b.url);
  if (toDelete.length) await del(toDelete);
  await put(key, JSON.stringify(value), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

const idxKey = `userid/${ADMIN_USER_ID}`;
const idx = await kvGet(idxKey);
if (!idx) {
  console.error(`❌ No userid index found for ${ADMIN_USER_ID}`);
  process.exit(1);
}
console.log(`✅ Found userid index → sub: ${idx.sub}`);

const account = await kvGet(`users/${idx.sub}`);
if (!account) {
  console.error(`❌ No account found for sub ${idx.sub}`);
  process.exit(1);
}
console.log(`✅ Found account: ${account.name} (${account.userId})`);

account.passwordHash = hashPassword(NEW_PASSWORD);
await kvSet(`users/${idx.sub}`, account);
console.log(`✅ Password reset to: ${NEW_PASSWORD}`);
