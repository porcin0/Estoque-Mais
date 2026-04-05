"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { Plus, ArrowDown, ArrowUp } from "lucide-react";

interface Movimentacao {
    id: string;
    tipo: string;
    quantidade: number;
    observacao: string | null;
    criadoEm: string;
    produto: { id: string; nome: string; sku: string };
    usuario: { id: string; nome: string };
}

export default function MovimentacoesPage() {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {
        carregarMovimentacoes();
    }, [filtroTipo]);

    async function carregarMovimentacoes() {
        setLoading(true);
        const params = new URLSearchParams();
        if (filtroTipo) params.set("tipo", filtroTipo);

        try {
            const res = await fetch(`/api/movimentacoes?${params}`);
            const data = await res.json();
            setMovimentacoes(data);
        } catch {
            console.error("Erro ao carregar movimentações");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header titulo="Movimentações" subtitulo="Histórico de entradas e saídas de estoque">
                <Link
                    href="/movimentacoes/nova"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium
            hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nova Movimentação
                </Link>
            </Header>

            {/* Filtro */}
            <div className="mb-4">
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">Todos os tipos</option>
                    <option value="ENTRADA">Entradas</option>
                    <option value="SAIDA">Saídas</option>
                </select>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando...</div>
                ) : movimentacoes.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Nenhuma movimentação registrada
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Produto</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-600">Quantidade</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Responsável</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Observação</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Data/Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {movimentacoes.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`p-1 rounded ${mov.tipo === "ENTRADA"
                                                            ? "bg-success-50 text-success-600"
                                                            : "bg-danger-50 text-danger-600"
                                                        }`}
                                                >
                                                    {mov.tipo === "ENTRADA" ? (
                                                        <ArrowDown className="w-4 h-4" />
                                                    ) : (
                                                        <ArrowUp className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${mov.tipo === "ENTRADA"
                                                            ? "bg-success-50 text-success-600"
                                                            : "bg-danger-50 text-danger-600"
                                                        }`}
                                                >
                                                    {mov.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{mov.produto.nome}</p>
                                                <p className="text-xs text-gray-500">{mov.produto.sku}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            {mov.quantidade}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{mov.usuario.nome}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                                            {mov.observacao || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {new Date(mov.criadoEm).toLocaleString("pt-BR")}
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
