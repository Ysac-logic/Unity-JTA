import { db } from "./db";

type N = { type: string; title: string; body?: string; link?: string; dedupeKey?: string };

async function create(data: N & { audience: string; userId?: string }) {
  if (data.dedupeKey) {
    const exists = await db.notification.findUnique({ where: { dedupeKey: data.dedupeKey } });
    if (exists) return;
  }
  await db.notification.create({ data });
}

export const notifyUser = (userId: string, n: N) => create({ ...n, audience: "USER", userId });
export const notifyStaff = (n: N) => create({ ...n, audience: "STAFF" });
