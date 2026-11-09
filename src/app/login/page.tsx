import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="relative isolate grid min-h-dvh overflow-hidden lg:grid-cols-[1.1fr_1fr]">
      <section className="relative z-10 hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" aria-label="Página inicial"><Brand /></Link>
        <div>
          <p className="eyebrow mb-4 !text-fg">Área do aluno e da equipe</p>
          <h1 className="title !text-[clamp(3.5rem,2rem+4vw,6rem)]">
            Seu treino
            <br />
            está te
            <br />
            <span className="inline-block -rotate-1 rounded-[0.12em] border border-white bg-brand px-[0.12em] pb-[0.04em]">esperando.</span>
          </h1>
          <p className="lead mt-6 max-w-md">Entre para ver seus treinos, registrar suas cargas e acompanhar sua evolução.</p>
        </div>
        <p className="text-sm font-medium text-muted">© {new Date().getFullYear()} LOW UNITY JTA</p>
      </section>

      <section className="relative z-10 flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
          <Link href="/" aria-label="Página inicial" className="mb-10 inline-block lg:hidden">
            <Brand />
          </Link>
          <h2 className="title !text-[clamp(2.5rem,2rem+2vw,3.5rem)]">Entrar</h2>
          <p className="mt-2 text-muted">Acesse sua área de aluno ou o painel da equipe.</p>
          <LoginForm />
          <details className="mt-8 rounded-2xl border border-line bg-surface-2 p-4 text-sm font-medium text-muted">
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
