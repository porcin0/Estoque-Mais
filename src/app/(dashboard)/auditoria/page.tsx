"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
    id: string;
    acao: string;
    entidade: string;
    entidadeId: string | null;
    detalhes: string | null;
    criadoEm: string;
    usuario: { nome: string; email: string };
}

const ACOES_LABEL: Record<string, string> = {
    LOGIN: "Login",
    CADASTRO: "Cadastro",
    EDICAO: "Edição",
    EXCLUSAO: "Exclusão",
    ENTRADA_ESTOQUE: "Entrada de Estoque",
    SAIDA_ESTOQUE: "Saída de Estoque",
};

const ACOES_COR: Record<string, string> = {
    LOGIN: "bg-primary-50 text-primary-600",
    CADASTRO: "bg-success-50 text-success-600",
    EDICAO: "bg-warning-50 text-warning-600",
    EXCLUSAO: "bg-danger-50 text-danger-600",
    ENTRADA_ESTOQUE: "bg-success-50 text-success-600",
    SAIDA_ESTOQUE: "bg-danger-50 text-danger-600",
};

export default function AuditoriaPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    useEffect(() => {
        // Proteção: OPERACIONAL não tem acesso
        const dados = localStorage.getItem("usuario");
        if (dados) {
            const usuario = JSON.parse(dados);
            if (usuario.role !== "GERENTE") {
                window.location.href = "/";
                return;
            }
        }

        carregarLogs();
    }, [pagina]);

    async function carregarLogs() {
        setLoading(true);
        try {
            const res = await fetch(`/api/auditoria?pagina=${pagina}`);
            const data = await res.json();
            setLogs(data.logs);
            setTotalPaginas(data.totalPaginas);
        } catch {
            console.error("Erro ao carregar logs");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header titulo="Auditoria" subtitulo="Registro de ações realizadas no sistema" />

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Nenhum registro de auditoria
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Data/Hora</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Ação</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Entidade</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Detalhes</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Usuário</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                                                {new Date(log.criadoEm).toLocaleString("pt-BR")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ACOES_COR[log.acao] || "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {ACOES_LABEL[log.acao] || log.acao}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{log.entidade}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                                                {log.detalhes || "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-xs font-medium text-gray-900">{log.usuario.nome}</p>
                                                    <p className="text-xs text-gray-400">{log.usuario.email}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        {totalPaginas > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Página {pagina} de {totalPaginas}
                                </p>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setPagina(Math.max(1, pagina - 1))}
                                        disabled={pagina === 1}
                                        className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setPagina(Math.min(totalPaginas, pagina + 1))}
                                        disabled={pagina === totalPaginas}
                                        className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
