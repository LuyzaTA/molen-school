import "server-only";
import { getSession } from "./auth";
import { getAccount, type AccountRecord } from "./store";

/** Returns the signed-in admin account, or null if not an admin. */
export async function getAdmin(): Promise<AccountRecord | null> {
  const session = await getSession();
  if (!session) return null;
  const account = await getAccount(session.sub);
  return account && account.isAdmin ? account : null;
}
