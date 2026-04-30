import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "cnpj_auth";

export function proxy(req: NextRequest) {
  const senha = process.env.APP_PASSWORD;

  // Sem senha configurada = app público
  if (!senha) return NextResponse.next();

  const path = req.nextUrl.pathname;
  // Rotas públicas: login e estáticos (já filtrados pelo matcher)
  if (path.startsWith("/login") || path.startsWith("/api/login")) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie === senha) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", path);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
