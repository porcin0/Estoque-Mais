"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Produto {
    id: string;
    nome: string;
    sku: string;
    quantidade: number;
}

export default function NovaMovimentacaoPage() {
    const router = useRouter();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [form, setForm] = useState({
        produtoId: "",
        tipo: "ENTRADA",
        quantidade: "",
        observacao: "",
    });

    useEffect(() => {
        fetch("/api/produtos")
            .then((res) => res.json())
            .then((data) => setProdutos(data.filter((p: Produto & { ativo: boolean }) => p.ativo)));
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const produtoSelecionado = produtos.find((p) => p.id === form.produtoId);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setLoading(true);

        try {
            const res = await fetch("/api/movimentacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    quantidade: parseInt(form.quantidade),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.error || "Erro ao registrar movimentação");
                return;
            }

            setSucesso("Movimentação registrada com sucesso!");
            setForm({ produtoId: "", tipo: "ENTRADA", quantidade: "", observacao: "" });

            setTimeout(() => {
                router.push("/movimentacoes");
                router.refresh();
            }, 1000);
        } catch {
            setErro("Erro de conexão");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header titulo="Nova Movimentação" subtitulo="Registrar entrada ou saída de estoque">
                <Link
                    href="/movimentacoes"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            </Header>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                        <select
                            name="produtoId"
                            value={form.produtoId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Selecione um produto...</option>
                            {produtos.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome} ({p.sku}) — Estoque: {p.quantidade}
                                </option>
                            ))}
                        </select>
                        {produtoSelecionado && (
                            <p className="text-xs text-gray-500 mt-1">
                                Estoque atual: <strong>{produtoSelecionado.quantidade}</strong> unidades
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="ENTRADA">Entrada</option>
                                <option value="SAIDA">Saída</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                            <input
                                name="quantidade"
                                type="number"
                                min="1"
                                value={form.quantidade}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                        <textarea
                            name="observacao"
                            value={form.observacao}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Motivo da movimentação (opcional)"
                        />
                    </div>

                    {erro && (
                        <div className="bg-danger-50 text-danger-600 text-sm px-3 py-2 rounded-md">{erro}</div>
                    )}
                    {sucesso && (
                        <div className="bg-success-50 text-success-600 text-sm px-3 py-2 rounded-md">{sucesso}</div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            href="/movimentacoes"
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
                            {loading ? "Registrando..." : "Registrar Movimentação"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
