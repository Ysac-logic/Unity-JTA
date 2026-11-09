import Link from "next/link";
import { Bell, Dumbbell, Wallet, TrendingUp, MessageCircle, CheckCheck } from "lucide-react";
import { fDateTime } from "@/lib/dates";
import { markAllRead } from "@/app/actions/notifications";
import { Button, EmptyState, cx } from "./ui";

const ICONS = { WORKOUT: Dumbbell, SESSION: Dumbbell, FINANCE: Wallet, EVOLUTION: TrendingUp, MESSAGE: MessageCircle } as const;

type N = { id: string; type: string; title: string; body: string | null; link: string | null; readAt: Date | null; createdAt: Date };

export function NotificationList({ items }: { items: N[] }) {
  const unread = items.some((n) => !n.readAt);
  if (items.length === 0) return <EmptyState icon={Bell} title="Tudo em dia" description="Nenhuma notificação por aqui." />;
  return (
    <>
      {unread && (
        <form action={markAllRead} className="mb-3 flex justify-end">
          <Button type="submit" variant="ghost" size="sm"><CheckCheck aria-hidden className="size-4" /> Marcar todas como lidas</Button>
        </form>
      )}
      <ul className="space-y-2">
        {items.map((n) => {
          const Icon = ICONS[n.type as keyof typeof ICONS] ?? Bell;
          const body = (
            <div className={cx("flex gap-3 rounded-[var(--radius-card)] border p-4 transition-colors", n.readAt ? "border-line bg-surface" : "border-brand/40 bg-brand-soft")}>
              <span className={cx("grid size-10 shrink-0 place-items-center rounded-full", n.readAt ? "bg-surface-3 text-muted" : "bg-brand text-white")}>
                <Icon aria-hidden className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{n.title}{!n.readAt && <span className="sr-only"> (não lida)</span>}</p>
                {n.body && <p className="text-sm text-muted">{n.body}</p>}
                <p className="mt-1 text-xs text-subtle tnum">{fDateTime(n.createdAt)}</p>
              </div>
            </div>
          );
          return <li key={n.id}>{n.link ? <Link href={n.link} className="block hover:opacity-90">{body}</Link> : body}</li>;
        })}
      </ul>
    </>
  );
}
