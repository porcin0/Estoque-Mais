"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    AlertTriangle,
} from "lucide-react";

interface Product {
    id: string;
    nome: string;
    sku: string;
    descricao: string | null;
    categoria: string;
    quantidade: number;
    estoqueMinimo: number;
    preco: number;
    ativo: boolean;
}

export default function ProdutosPage() {
    const router = useRouter();
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [excluindo, setExcluindo] = useState<string | null>(null);
    const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function carregarProdutos() {
        setLoading(true);
        try {
            const res = await fetch("/api/produtos");
            const data = await res.json();
            setProdutos(data);
        } catch {
            console.error("Erro ao carregar produtos");
        } finally {
            setLoading(false);
        }
    }

    async function excluirProduto(id: string) {
        if (!confirm("Tem certeza que deseja desativar este produto?")) return;
        setExcluindo(id);
        try {
            const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMensagem({ tipo: "sucesso", texto: "Produto desativado com sucesso" });
                carregarProdutos();
            } else {
                setMensagem({ tipo: "erro", texto: "Erro ao desativar produto" });
            }
        } catch {
            setMensagem({ tipo: "erro", texto: "Erro de conexão" });
        } finally {
            setExcluindo(null);
            setTimeout(() => setMensagem(null), 3000);
        }
    }

    const produtosFiltrados = produtos.filter(
        (p) =>
            p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.sku.toLowerCase().includes(busca.toLowerCase()) ||
            p.categoria.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <>
            <Header titulo="Produtos" subtitulo="Gerencie o catálogo de produtos">
                <Link
                    href="/produtos/novo"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium
            hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Produto
                </Link>
            </Header>

            {mensagem && (
                <div
                    className={`mb-4 px-4 py-3 rounded-md text-sm ${mensagem.tipo === "sucesso"
                        ? "bg-success-50 text-success-600"
                        : "bg-danger-50 text-danger-600"
                        }`}
                >
                    {mensagem.texto}
                </div>
            )}

            <div className="mb-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, SKU ou categoria..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando...</div>
                ) : produtosFiltrados.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        {busca ? "Nenhum produto encontrado para esta busca" : "Nenhum produto cadastrado"}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Produto</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-600">Estoque</th>
                                    <th className="text-right px-4 py-3 font-medium text-gray-600">Preço</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                                    <th className="text-center px-4 py-3 font-medium text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {produtosFiltrados.map((produto) => {
                                    const estoqueBaixo = produto.quantidade < produto.estoqueMinimo;
                                    return (
                                        <tr key={produto.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{produto.nome}</span>
                                                    {estoqueBaixo && (
                                                        <span title="Estoque abaixo do mínimo">
                                                            <AlertTriangle className="w-4 h-4 text-danger-500" />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{produto.sku}</td>
                                            <td className="px-4 py-3 text-gray-600">{produto.categoria}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`font-medium ${estoqueBaixo ? "text-danger-600" : "text-gray-900"}`}>
                                                    {produto.quantidade}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-1">/ mín {produto.estoqueMinimo}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-900">
                                                R$ {produto.preco.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${produto.ativo
                                                        ? "bg-success-50 text-success-600"
                                                        : "bg-gray-100 text-gray-500"
                                                        }`}
                                                >
                                                    {produto.ativo ? "Ativo" : "Inativo"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => router.push(`/produtos/${produto.id}/editar`)}
                                                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => excluirProduto(produto.id)}
                                                        disabled={excluindo === produto.id}
                                                        className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors
                              disabled:opacity-50"
                                                        title="Desativar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
