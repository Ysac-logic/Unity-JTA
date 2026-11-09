"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { isStaffRole } from "@/lib/session-token";

export async function login(_: { error?: string } | undefined, fd: FormData) {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "E-mail ou senha incorretos. Confira os dados e tente novamente." };
  }
  await createSession(user);
  redirect(isStaffRole(user.role) ? "/admin" : "/aluno");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
