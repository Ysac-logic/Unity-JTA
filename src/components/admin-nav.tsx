"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Dumbbell, Library, TrendingUp, Wallet, Bell, ScrollText, Settings, Menu, X, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Avatar, Brand, cx } from "./ui";

const items = [
  { href: "/admin", label: "Início", Icon: LayoutDashboard, exact: true },
  { href: "/admin/alunos", label: "Alunos", Icon: Users },
  { href: "/admin/treinos", label: "Treinos", Icon: Dumbbell },
  { href: "/admin/exercicios", label: "Exercícios", Icon: Library },
  { href: "/admin/evolucao", label: "Evolução", Icon: TrendingUp },
  { href: "/admin/financeiro", label: "Financeiro", Icon: Wallet, badge: "late" },
  { href: "/admin/notificacoes", label: "Notificações", Icon: Bell, badge: "notif" },
  { href: "/admin/atividades", label: "Atividades", Icon: ScrollText },
  { href: "/admin/configuracoes", label: "Configurações", Icon: Settings },
] as const;

type Counts = { late: number; notif: number };

function NavList({ counts, onNavigate }: { counts: Counts; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <ul className="space-y-0.5">
      {items.map((it) => {
        const active = "exact" in it ? path === it.href : path.startsWith(it.href);
        const n = "badge" in it ? counts[it.badge] : 0;
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cx(
                "relative flex h-11 items-center gap-3 rounded-full px-4 text-[15px] font-bold transition-colors",
                active ? "border border-brand bg-brand text-white" : "border border-transparent text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              <it.Icon aria-hidden className={cx("size-5", active && "text-white")} />
              <span className="flex-1">{it.label}</span>
              {n > 0 && (
                <span className="rounded-full bg-brand px-1.5 text-xs font-bold leading-5 text-white tnum">
                  {n}
                  <span className="sr-only"> pendentes</span>
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserBox({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-line p-4">
      <Avatar name={name} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="text-xs text-subtle">{role}</p>
      </div>
      <form action={logout}>
        <button type="submit" aria-label="Sair" className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg cursor-pointer">
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}

export function AdminNav({ name, role, counts }: { name: string; role: string; counts: Counts }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/admin"><Brand /></Link>
        </div>
        <p className="eyebrow px-5 pb-2 pt-2 text-[10px]">Painel da equipe</p>
        <nav aria-label="Painel" className="flex-1 overflow-y-auto px-3">
          <NavList counts={counts} />
        </nav>
        <UserBox name={name} role={role} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg px-4 pt-[env(safe-area-inset-top)] lg:hidden">
        <Link href="/admin"><Brand compact /></Link>
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open} aria-controls="admin-drawer" className="relative grid size-11 place-items-center rounded-lg text-fg hover:bg-surface-2 cursor-pointer">
          <Menu className="size-6" />
          {counts.late + counts.notif > 0 && <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-brand" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div id="admin-drawer" className="absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col border-l border-line bg-surface">
            <div className="flex h-14 items-center justify-between px-4">
              <span className="eyebrow">Painel da equipe</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="grid size-11 place-items-center rounded-lg hover:bg-surface-2 cursor-pointer" autoFocus>
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Painel" className="flex-1 overflow-y-auto px-3">
              <NavList counts={counts} onNavigate={() => setOpen(false)} />
            </nav>
            <UserBox name={name} role={role} />
          </div>
        </div>
      )}
    </>
  );
}
