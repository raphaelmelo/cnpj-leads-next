import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE = "cnpj_auth";

async function autenticar(formData: FormData) {
  "use server";
  const senha = String(formData.get("senha") ?? "");
  const correta = process.env.APP_PASSWORD;
  const from = String(formData.get("from") ?? "/");

  if (!correta || senha === correta) {
    const jar = await cookies();
    jar.set(COOKIE, senha, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    redirect(from || "/");
  }
  redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50">
      <form
        action={autenticar}
        className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-8 shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">🏗️ Leads — Incorporadoras</h1>
          <p className="text-sm text-zinc-500">Acesso restrito</p>
        </div>

        <input type="hidden" name="from" value={sp.from ?? "/"} />
        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            name="senha"
            required
            autoFocus
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        {sp.error && (
          <p className="text-sm text-rose-600">Senha incorreta.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
