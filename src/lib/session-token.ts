import { SignJWT, jwtVerify } from "jose";

export type Role = "ADMIN" | "TRAINER" | "STUDENT";
export type SessionPayload = { uid: string; role: Role; name: string };

export const SESSION_COOKIE = "luj_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-low-unity-jta");

export async function signSession(p: SessionPayload) {
  return new SignJWT(p).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret());
}

export async function verifySession(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const isStaffRole = (r?: string) => r === "ADMIN" || r === "TRAINER";
