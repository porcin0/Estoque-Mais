"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import {
    Package,
    AlertTriangle,
    ArrowLeftRight,
    Users,
    ArrowDown,
    ArrowUp,
} from "lucide-react";

interface DashboardData {
    totalProdutos: number;
    produtosEstoqueBaixo: number;
    totalMovimentacoes: number;
    totalUsuarios: number;
    movimentacoesRecentes: Array<{
        id: string;
        tipo: string;
        quantidade: number;
        criadoEm: string;
        produto: { nome: string; sku: string };
        usuario: { nome: string };
    }>;
    alertas: Array<{
        id: string;
        nome: string;
        sku: string;
        quantidade: number;
        estoqueMinimo: number;
    }>;
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Erro ao carregar dados</p>
            </div>
        );
    }

    const cards = [
        {
            label: "Produtos Ativos",
            valor: data.totalProdutos,
            icon: Package,
            cor: "bg-primary-50 text-primary-600",
        },
        {
            label: "Estoque Baixo",
            valor: data.produtosEstoqueBaixo,
            icon: AlertTriangle,
            cor: data.produtosEstoqueBaixo > 0
                ? "bg-danger-50 text-danger-600"
                : "bg-success-50 text-success-600",
        },
        {
            label: "Movimentações",
            valor: data.totalMovimentacoes,
            icon: ArrowLeftRight,
            cor: "bg-warning-50 text-warning-600",
        },
        {
            label: "Usuários Ativos",
            valor: data.totalUsuarios,
            icon: Users,
            cor: "bg-primary-50 text-primary-600",
        },
    ];

    return (
        <>
            <Header titulo="Dashboard" subtitulo="Visão geral do estoque" />

            {/* Cards resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-lg border border-gray-200 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {card.valor}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.cor}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Movimentações recentes */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">
                            Movimentações Recentes
                        </h2>
                    </div>
                    <div className="p-5">
                        {data.movimentacoesRecentes.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                Nenhuma movimentação registrada
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.movimentacoesRecentes.map((mov) => (
                                    <div
                                        key={mov.id}
                                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-1.5 rounded ${mov.tipo === "ENTRADA"
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
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {mov.produto.nome}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {mov.usuario.nome} •{" "}
                                                    {new Date(mov.criadoEm).toLocaleDateString("pt-BR")}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${mov.tipo === "ENTRADA"
                                                    ? "text-success-600"
                                                    : "text-danger-600"
                                                }`}
                                        >
                                            {mov.tipo === "ENTRADA" ? "+" : "-"}
                                            {mov.quantidade}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Alertas de estoque baixo */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">
                            Alertas de Estoque Baixo
                        </h2>
                    </div>
                    <div className="p-5">
                        {data.alertas.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                Nenhum produto com estoque baixo
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.alertas.map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {prod.nome}
                                            </p>
                                            <p className="text-xs text-gray-500">{prod.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-danger-600">
                                                {prod.quantidade} un.
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Mín: {prod.estoqueMinimo}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
