"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isStaffRole, requireUser } from "@/lib/auth";

export async function markAllRead() {
  const user = await requireUser();
  const where = isStaffRole(user.role) ? { audience: "STAFF", readAt: null } : { userId: user.id, readAt: null };
  await db.notification.updateMany({ where, data: { readAt: new Date() } });
  revalidatePath(isStaffRole(user.role) ? "/admin" : "/aluno", "layout");
}
