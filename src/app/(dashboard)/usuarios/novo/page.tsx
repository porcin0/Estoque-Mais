"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoUsuarioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        role: "OPERACIONAL",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const res = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao criar usuário");
                return;
            }

            router.push("/usuarios");
            router.refresh();
        } catch {
            setErro("Erro de conexão");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header titulo="Novo Usuário" subtitulo="Cadastrar um novo usuário no sistema">
                <Link
                    href="/usuarios"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            </Header>

            <div className="max-w-md">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                        <input
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Nome completo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="usuario@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                        <input
                            name="senha"
                            type="password"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Perfil *</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="OPERACIONAL">Operacional</option>
                            <option value="ADMIN">Gerente / Administrador</option>
                        </select>
                    </div>

                    {erro && (
                        <div className="bg-danger-50 text-danger-600 text-sm px-3 py-2 rounded-md">{erro}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/usuarios"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md
                hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md
                hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Salvando..." : "Cadastrar Usuário"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
