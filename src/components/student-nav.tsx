"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, TrendingUp, Wallet, User } from "lucide-react";
import { cx } from "./ui";

const items = [
  { href: "/aluno", label: "Início", Icon: Home, exact: true },
  { href: "/aluno/treinos", label: "Treinos", Icon: Dumbbell },
  { href: "/aluno/evolucao", label: "Evolução", Icon: TrendingUp },
  { href: "/aluno/financeiro", label: "Financeiro", Icon: Wallet },
  { href: "/aluno/perfil", label: "Perfil", Icon: User },
];

export function StudentNav() {
  const path = usePathname();
  if (path.endsWith("/executar")) return null;
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-bg pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact ? path === href : path.startsWith(href) || (href === "/aluno/treinos" && path.startsWith("/aluno/historico"));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors", active ? "text-fg" : "text-muted hover:text-fg")}
              >
                <span className={cx("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-brand text-white")}>
                  <Icon aria-hidden className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
