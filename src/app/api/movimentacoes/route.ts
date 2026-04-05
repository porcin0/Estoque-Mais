import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/audit";

// GET /api/movimentacoes
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo") || "";
    const produtoId = searchParams.get("produtoId") || "";

    const where: Record<string, unknown> = {};
    if (tipo) where.tipo = tipo;
    if (produtoId) where.produtoId = produtoId;

    const movimentacoes = await prisma.stockMovement.findMany({
        where,
        orderBy: { criadoEm: "desc" },
        include: {
            produto: { select: { id: true, nome: true, sku: true } },
            usuario: { select: { id: true, nome: true } },
        },
    });

    return NextResponse.json(movimentacoes);
}

// POST /api/movimentacoes
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { produtoId, tipo, quantidade, observacao } = body;

        if (!produtoId || !tipo || !quantidade) {
            return NextResponse.json(
                { error: "Campos obrigatórios: produtoId, tipo, quantidade" },
                { status: 400 }
            );
        }

        if (!["ENTRADA", "SAIDA"].includes(tipo)) {
            return NextResponse.json(
                { error: "Tipo deve ser ENTRADA ou SAIDA" },
                { status: 400 }
            );
        }

        const qtd = parseInt(quantidade);
        if (qtd <= 0) {
            return NextResponse.json(
                { error: "Quantidade deve ser maior que zero" },
                { status: 400 }
            );
        }

        const produto = await prisma.product.findUnique({
            where: { id: produtoId },
        });

        if (!produto) {
            return NextResponse.json(
                { error: "Produto não encontrado" },
                { status: 404 }
            );
        }

        if (tipo === "SAIDA" && produto.quantidade < qtd) {
            return NextResponse.json(
                { error: `Estoque insuficiente. Disponível: ${produto.quantidade}` },
                { status: 400 }
            );
        }

        // Usa o primeiro usuário como responsável
        const usuario = await prisma.user.findFirst({ orderBy: { criadoEm: "asc" } });
        if (!usuario) {
            return NextResponse.json(
                { error: "Nenhum usuário cadastrado no sistema" },
                { status: 400 }
            );
        }

        const [movimentacao] = await prisma.$transaction([
            prisma.stockMovement.create({
                data: {
                    tipo,
                    quantidade: qtd,
                    observacao: observacao || null,
                    produtoId,
                    usuarioId: usuario.id,
                },
                include: {
                    produto: { select: { nome: true, sku: true } },
                    usuario: { select: { nome: true } },
                },
            }),
            prisma.product.update({
                where: { id: produtoId },
                data: {
                    quantidade: tipo === "ENTRADA"
                        ? produto.quantidade + qtd
                        : produto.quantidade - qtd,
                },
            }),
        ]);

        await registrarAuditoria({
            acao: tipo === "ENTRADA" ? "ENTRADA_ESTOQUE" : "SAIDA_ESTOQUE",
            entidade: "StockMovement",
            entidadeId: movimentacao.id,
            detalhes: `${tipo === "ENTRADA" ? "Entrada" : "Saída"} de ${qtd} unidades - ${produto.nome} (${produto.sku})`,
            usuarioId: usuario.id,
        });

        return NextResponse.json(movimentacao, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar movimentação:", error);
        return NextResponse.json(
            { error: "Erro ao registrar movimentação" },
            { status: 500 }
        );
    }
}
