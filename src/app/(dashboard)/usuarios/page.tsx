"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { Plus, UserCheck, UserX } from "lucide-react";

interface Usuario {
    id: string;
    nome: string;
    email: string;
    role: string;
    ativo: boolean;
    criadoEm: string;
}

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Proteção: OPERACIONAL não tem acesso
        const dados = localStorage.getItem("usuario");
        if (dados) {
            const usuario = JSON.parse(dados);
            if (usuario.role !== "ADMIN") {
                window.location.href = "/";
                return;
            }
        }

        fetch("/api/usuarios")
            .then((res) => res.json())
            .then(setUsuarios)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function toggleAtivo(id: string, ativo: boolean) {
        try {
            const res = await fetch(`/api/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ativo: !ativo }),
            });
            if (res.ok) {
                setUsuarios(
                    usuarios.map((u) => (u.id === id ? { ...u, ativo: !ativo } : u))
                );
            }
        } catch {
            console.error("Erro ao atualizar usuário");
        }
    }

    return (
        <>
            <Header titulo="Usuários" subtitulo="Gerenciar usuários do sistema">
                <Link
                    href="/usuarios/novo"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium
            hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Usuário
                </Link>
            </Header>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando...</div>
                ) : usuarios.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Nenhum usuário cadastrado
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Perfil</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Criado em</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {usuarios.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{user.nome}</td>
                                        <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "ADMIN"
                                                    ? "bg-primary-50 text-primary-600"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {user.role === "ADMIN" ? "Gerente" : "Operacional"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${user.ativo
                                                    ? "bg-success-50 text-success-600"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {user.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-500 text-xs">
                                            {new Date(user.criadoEm).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleAtivo(user.id, user.ativo)}
                                                className={`p-1.5 rounded transition-colors ${user.ativo
                                                    ? "text-gray-400 hover:text-danger-600 hover:bg-danger-50"
                                                    : "text-gray-400 hover:text-success-600 hover:bg-success-50"
                                                    }`}
                                                title={user.ativo ? "Desativar" : "Ativar"}
                                            >
                                                {user.ativo ? (
                                                    <UserX className="w-4 h-4" />
                                                ) : (
                                                    <UserCheck className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
