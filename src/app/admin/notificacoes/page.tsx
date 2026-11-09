import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { syncFinanceAlerts } from "@/lib/finance";
import { PageHeader } from "@/components/ui";
import { NotificationList } from "@/components/notification-list";

export const metadata = { title: "Notificações" };

export default async function StaffNotifications() {
  await requireStaff();
  await syncFinanceAlerts();
  const items = await db.notification.findMany({ where: { audience: "STAFF" }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <PageHeader eyebrow="Caixa da equipe" title="Notificações" description="Alertas compartilhados entre os três treinadores." />
      <div className="max-w-2xl">
        <NotificationList items={items} />
      </div>
    </>
  );
}
