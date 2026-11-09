"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, requireStaff, requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { ROLES, str, toCents } from "@/lib/labels";

export async function createStaff(_: { error?: string; ok?: boolean } | undefined, fd: FormData) {
  const admin = await requireAdmin();
  const name = str(fd.get("name"));
  const email = str(fd.get("email"))?.toLowerCase();
  const password = String(fd.get("password") ?? "");
  const role = fd.get("role") === "ADMIN" ? "ADMIN" : "TRAINER";
  if (!name || !email) return { error: "Nome e e-mail são obrigatórios." };
  if (password.length < 6) return { error: "A senha precisa ter pelo menos 6 caracteres." };
  if (await db.user.findUnique({ where: { email } })) return { error: "Já existe um usuário com este e-mail." };
  const u = await db.user.create({ data: { name, email, role, phone: str(fd.get("phone")), passwordHash: await bcrypt.hash(password, 10) } });
  await logActivity({ actorId: admin.id, action: "user.create", entityType: "user", entityId: u.id, description: `${ROLES[role]} ${name} cadastrado por ${admin.name}.` });
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}

export async function toggleUser(id: string) {
  const admin = await requireAdmin();
  if (id === admin.id) return;
  const u = await db.user.findUniqueOrThrow({ where: { id } });
  await db.user.update({ where: { id }, data: { active: !u.active } });
  await logActivity({ actorId: admin.id, action: "user.toggle", entityType: "user", entityId: id, description: `Acesso de ${u.name} ${u.active ? "desativado" : "reativado"} por ${admin.name}.` });
  revalidatePath("/admin/configuracoes");
}

export async function savePlan(fd: FormData) {
  const actor = await requireStaff();
  const id = str(fd.get("id"));
  const name = str(fd.get("name"));
  const priceCents = toCents(fd.get("price"));
  if (!name || priceCents <= 0) return;
  const data = { name, priceCents, intervalMonths: Math.max(1, Number(fd.get("intervalMonths") ?? 1)), description: str(fd.get("description")) };
  const p = id ? await db.plan.update({ where: { id }, data }) : await db.plan.create({ data });
  await logActivity({ actorId: actor.id, action: id ? "plan.update" : "plan.create", entityType: "plan", entityId: p.id, description: `Plano "${name}" ${id ? "editado" : "criado"} por ${actor.name}.` });
  revalidatePath("/admin/configuracoes");
}

export async function changePassword(_: { error?: string; ok?: boolean } | undefined, fd: FormData) {
  const user = await requireUser();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (!(await bcrypt.compare(current, user.passwordHash))) return { error: "Senha atual incorreta." };
  if (next.length < 6) return { error: "A nova senha precisa ter pelo menos 6 caracteres." };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: true };
}

export async function updateOwnProfile(fd: FormData) {
  const user = await requireUser();
  await db.user.update({ where: { id: user.id }, data: { phone: str(fd.get("phone")), name: str(fd.get("name")) ?? user.name } });
  revalidatePath("/aluno/perfil");
  revalidatePath("/admin/configuracoes");
}

export async function resetUserPassword(userId: string, fd: FormData) {
  const actor = await requireStaff();
  const target = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (target.role !== "STUDENT" && actor.role !== "ADMIN") return;
  const pwd = String(fd.get("password") ?? "");
  if (pwd.length < 6) return;
  await db.user.update({ where: { id: userId }, data: { passwordHash: await bcrypt.hash(pwd, 10) } });
  await logActivity({ actorId: actor.id, action: "user.password", entityType: "user", entityId: userId, description: `Senha de ${target.name} redefinida por ${actor.name}.` });
}
