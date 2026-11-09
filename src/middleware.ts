import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession, isStaffRole } from "@/lib/session-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const home = (role?: string) => new URL(isStaffRole(role) ? "/admin" : "/aluno", req.url);

  if (pathname === "/login") return session ? NextResponse.redirect(home(session.role)) : NextResponse.next();
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  if (pathname.startsWith("/admin") && !isStaffRole(session.role)) return NextResponse.redirect(home(session.role));
  if (pathname.startsWith("/aluno") && session.role !== "STUDENT") return NextResponse.redirect(home(session.role));
  return NextResponse.next();
}

export const config = { matcher: ["/login", "/admin/:path*", "/aluno/:path*"] };
