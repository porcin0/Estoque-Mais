"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao fazer login");
                return;
            }

            // Salva os dados do usuário no localStorage
            localStorage.setItem("usuario", JSON.stringify(data));
            router.push("/dashboard");
        } catch {
            setErro("Erro de conexão com o servidor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Image
                        src="/logo.jpg"
                        alt="Estoque+ Logo"
                        width={220}
                        height={220}
                        className="mx-auto mb-2"
                        priority
                    />
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 text-center">Entrar</h2>

                    {erro && (
                        <div className="bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded-md">
                            {erro}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-2 rounded-md text-sm font-medium
              hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                    {/* Credenciais de teste */}
                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <p className="text-xs text-gray-400 text-center mb-2">Credenciais de demonstração</p>
                        <div className="space-y-1.5 text-xs text-gray-500">
                            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
                                <span>admin@estoqueplus.com</span>
                                <span className="text-gray-400">admin123</span>
                            </div>
                            <div className="flex justify-between bg-gray-50 px-3 py-1.5 rounded">
                                <span>operador@estoqueplus.com</span>
                                <span className="text-gray-400">operador123</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
