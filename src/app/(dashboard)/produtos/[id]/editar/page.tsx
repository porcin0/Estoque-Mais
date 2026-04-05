"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [erro, setErro] = useState("");
    const [form, setForm] = useState({
        nome: "",
        sku: "",
        descricao: "",
        categoria: "",
        estoqueMinimo: "5",
        preco: "",
        ativo: true,
    });

    useEffect(() => {
        fetch(`/api/produtos/${id}`)
            .then((res) => res.json())
            .then((produto) => {
                setForm({
                    nome: produto.nome,
                    sku: produto.sku,
                    descricao: produto.descricao || "",
                    categoria: produto.categoria,
                    estoqueMinimo: String(produto.estoqueMinimo),
                    preco: String(produto.preco),
                    ativo: produto.ativo,
                });
            })
            .catch(() => setErro("Erro ao carregar produto"))
            .finally(() => setLoadingData(false));
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const res = await fetch(`/api/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    estoqueMinimo: parseInt(form.estoqueMinimo),
                    preco: parseFloat(form.preco),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao editar produto");
                return;
            }

            router.push("/produtos");
            router.refresh();
        } catch {
            setErro("Erro de conexão");
        } finally {
            setLoading(false);
        }
    }

    const categorias = ["Alimentos", "Limpeza", "Papelaria", "Bebidas", "Higiene", "Outros"];

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    return (
        <>
            <Header titulo="Editar Produto" subtitulo="Altere os dados do produto">
                <Link
                    href="/produtos"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            </Header>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                            <input
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Código *</label>
                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                            <select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Selecione...</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                            <input
                                name="preco"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.preco}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                            <input
                                name="estoqueMinimo"
                                type="number"
                                min="0"
                                value={form.estoqueMinimo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer pb-2">
                                <input
                                    name="ativo"
                                    type="checkbox"
                                    checked={form.ativo}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">Produto ativo</span>
                            </label>
                        </div>
                    </div>

                    {erro && (
                        <div className="bg-danger-50 text-danger-600 text-sm px-3 py-2 rounded-md">{erro}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/produtos"
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
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
