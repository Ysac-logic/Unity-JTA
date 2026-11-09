import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="sys relative isolate grid min-h-dvh overflow-hidden lg:grid-cols-[1.1fr_1fr]">
      <section className="relative z-10 hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" aria-label="Página inicial"><Brand /></Link>
        <div>
          <h1 className="title !text-[clamp(3rem,2rem+3.5vw,5rem)]">
            Seu treino
            <br />
            está te
            <br />
            <span className="italic text-brand-text">esperando.</span>
          </h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted">Treino · Evolução · Juntos</p>
          <p className="lead mt-6 max-w-md">Entre para ver seus treinos, registrar suas cargas e acompanhar sua evolução.</p>
        </div>
        <p className="text-sm font-medium text-muted">© {new Date().getFullYear()} LOW UNITY JTA</p>
      </section>

      <section className="relative z-10 flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm card-glow rounded-[var(--radius-card)] border border-line p-6 sm:p-8">
          <Link href="/" aria-label="Página inicial" className="mb-8 flex justify-center lg:hidden">
            <Brand />
          </Link>
          <h2 className="font-display text-3xl">Bem-vindo de volta!</h2>
          <p className="mt-2 text-muted">Faça login para continuar sua jornada.</p>
          <LoginForm />
          <details className="mt-8 rounded-xl border border-line bg-surface-2 p-4 text-sm font-medium text-muted">
            <summary className="cursor-pointer font-semibold text-fg">Contas de demonstração</summary>
            <ul className="mt-3 space-y-1.5 tnum">
              <li><span className="font-bold text-fg">Admin:</span> admin@lowunity.com</li>
              <li><span className="font-bold text-fg">Personal:</span> tallison@lowunity.com</li>
              <li><span className="font-bold text-fg">Aluno:</span> joao@email.com</li>
              <li className="pt-1">Senha de todas: <span className="font-bold text-fg">123456</span></li>
            </ul>
          </details>
        </div>
      </section>
    </main>
  );
}
