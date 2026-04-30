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
    <div className="min-h-screen grid place-items-center bg-white dark:bg-slate-950">
      <form
        action={autenticar}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">🏗️ Leads</h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Painel de incorporadoras · Acesso restrito</p>
        </div>

        <input type="hidden" name="from" value={sp.from ?? "/"} />
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Senha de acesso</label>
          <input
            type="password"
            name="senha"
            required
            autoFocus
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Digite sua senha"
          />
        </div>

        {sp.error && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3 border border-red-200/50 dark:border-red-500/20">🔒 Senha incorreta. Tente novamente.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95 dark:shadow-blue-500/15 uppercase tracking-wide"
        >
          🔓 Entrar
        </button>
      </form>
    </div>
  );
}
