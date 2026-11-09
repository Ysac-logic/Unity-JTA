import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { SESSION_COOKIE, signSession, verifySession, isStaffRole, type Role } from "./session-token";

export async function createSession(user: { id: string; role: string; name: string }) {
  const token = await signSession({ uid: user.id, role: user.role as Role, name: user.name });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  const user = await db.user.findUnique({ where: { id: s.uid }, include: { student: true } });
  return user && user.active ? user : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireStaff() {
  const user = await requireUser();
  if (!isStaffRole(user.role)) redirect("/aluno");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

export async function requireStudent() {
  const user = await requireUser();
  if (user.role !== "STUDENT" || !user.student) redirect("/admin");
  return { user, student: user.student };
}

/** Regra central: a equipe acessa todos os alunos; o aluno acessa apenas a si mesmo. */
export function canAccessStudent(user: { role: string; student?: { id: string } | null }, studentId: string) {
  if (isStaffRole(user.role)) return true;
  return user.role === "STUDENT" && user.student?.id === studentId;
}

export { isStaffRole };
