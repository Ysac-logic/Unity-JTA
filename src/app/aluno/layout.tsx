import Link from "next/link";
import { Bell, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/auth";
import { Brand } from "@/components/ui";
import { StudentNav } from "@/components/student-nav";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireStudent();
  const unread = await db.notification.count({ where: { userId: user.id, readAt: null } });

  return (
    <div className="sys min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/aluno" aria-label="Início">
            <Brand compact />
          </Link>
          <div className="flex items-center gap-1">
            <IconLink href="/aluno/mensagens" label="Falar com os personais" count={0}>
              <MessageCircle className="size-5" />
            </IconLink>
            <IconLink href="/aluno/notificacoes" label="Notificações" count={unread}>
              <Bell className="size-5" />
            </IconLink>
          </div>
        </div>
      </header>
      <main id="conteudo" className="mx-auto max-w-2xl px-4 pt-5">
        {children}
      </main>
      <StudentNav />
    </div>
  );
}

function IconLink({ href, label, count, children }: { href: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={count ? `${label}: ${count} não lidas` : label} className="relative grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg">
      {children}
      {count > 0 && (
        <span aria-hidden className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-4 text-fg tnum">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
