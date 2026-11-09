import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { NotificationList } from "@/components/notification-list";

export const metadata = { title: "Notificações" };

export default async function StudentNotifications() {
  const { user } = await requireStudent();
  const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 80 });
  return (
    <>
      <PageHeader title="Notificações" />
      <NotificationList items={items} />
    </>
  );
}
