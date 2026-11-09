import { db } from "@/lib/db";
import { requireStaff } from "@/lib/auth";
import { today } from "@/lib/dates";
import { ROLES } from "@/lib/labels";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const [late, notif] = await Promise.all([
    db.invoice.count({ where: { status: "OPEN", dueDate: { lt: today() }, subscription: { status: "ACTIVE" } } }),
    db.notification.count({ where: { audience: "STAFF", readAt: null } }),
  ]);
  return (
    <div className="sys min-h-dvh">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>
      <AdminNav name={user.name} role={ROLES[user.role]} counts={{ late, notif }} />
      <main id="conteudo" className="px-4 pb-16 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
