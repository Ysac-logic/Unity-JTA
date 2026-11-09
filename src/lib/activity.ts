import { db } from "./db";

export async function logActivity(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  studentId?: string;
  description: string;
}) {
  await db.activityLog.create({ data: input });
}
