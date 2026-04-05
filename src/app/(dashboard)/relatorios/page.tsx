"use client";

import { useState } from "react";
import Header from "@/components/header";
import { Download, FileText, ArrowLeftRight } from "lucide-react";

export default function RelatoriosPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [erro, setErro] = useState("");

    function downloadCSV(conteudo: string, nomeArquivo: string) {
        // Adicionar BOM para UTF-8 no Excel
        const bom = "\uFEFF";
        const blob = new Blob([bom + conteudo], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function exportarProdutos() {
        setLoading("produtos");
        setErro("");
        try {
            const res = await fetch("/api/relatorios/produtos");
            if (!res.ok) throw new Error("Erro ao buscar dados");
            const produtos = await res.json();

            const cabecalho = "Nome;SKU;Categoria;Quantidade;Estoque Mínimo;Preço;Status\n";
            const linhas = produtos
                .map(
                    (p: { nome: string; sku: string; categoria: string; quantidade: number; estoqueMinimo: number; preco: number; ativo: boolean }) =>
                        `${p.nome};${p.sku};${p.categoria};${p.quantidade};${p.estoqueMinimo};${p.preco.toFixed(2)};${p.ativo ? "Ativo" : "Inativo"}`
                )
                .join("\n");

            downloadCSV(cabecalho + linhas, `produtos_${new Date().toISOString().split("T")[0]}.csv`);
        } catch {
            setErro("Erro ao exportar produtos");
        } finally {
            setLoading(null);
        }
    }

    async function exportarMovimentacoes() {
        setLoading("movimentacoes");
        setErro("");
        try {
            const res = await fetch("/api/relatorios/movimentacoes");
            if (!res.ok) throw new Error("Erro ao buscar dados");
            const movimentacoes = await res.json();

            const cabecalho = "Data;Tipo;Produto;SKU;Quantidade;Responsável;Observação\n";
            const linhas = movimentacoes
                .map(
                    (m: {
                        criadoEm: string;
                        tipo: string;
                        produto: { nome: string; sku: string };
                        quantidade: number;
                        usuario: { nome: string };
                        observacao: string | null;
                    }) =>
                        `${new Date(m.criadoEm).toLocaleString("pt-BR")};${m.tipo === "ENTRADA" ? "Entrada" : "Saída"};${m.produto.nome};${m.produto.sku};${m.quantidade};${m.usuario.nome};${m.observacao || ""}`
                )
                .join("\n");

            downloadCSV(
                cabecalho + linhas,
                `movimentacoes_${new Date().toISOString().split("T")[0]}.csv`
            );
        } catch {
            setErro("Erro ao exportar movimentações");
        } finally {
            setLoading(null);
        }
    }

    return (
        <>
            <Header titulo="Relatórios" subtitulo="Exporte dados do sistema em formato CSV" />

            {erro && (
                <div className="mb-4 bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded-md">
                    {erro}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                {/* Card Produtos */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary-50 text-primary-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Produtos</h2>
                            <p className="text-xs text-gray-500">
                                Lista completa de produtos cadastrados
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Exporta nome, SKU, categoria, quantidade em estoque, estoque mínimo,
                        preço e status de todos os produtos.
                    </p>
                    <button
                        onClick={exportarProdutos}
                        disabled={loading === "produtos"}
                        className="flex items-center gap-2 w-full justify-center bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium
              hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        {loading === "produtos" ? "Exportando..." : "Exportar CSV"}
                    </button>
                </div>

                {/* Card Movimentações */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-warning-50 text-warning-600 rounded-lg">
                            <ArrowLeftRight className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Movimentações</h2>
                            <p className="text-xs text-gray-500">
                                Histórico completo de entradas e saídas
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Exporta data, tipo, produto, quantidade, responsável e observação
                        de todas as movimentações.
                    </p>
                    <button
                        onClick={exportarMovimentacoes}
                        disabled={loading === "movimentacoes"}
                        className="flex items-center gap-2 w-full justify-center bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium
              hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        {loading === "movimentacoes" ? "Exportando..." : "Exportar CSV"}
                    </button>
                </div>
            </div>
        </>
    );
}
