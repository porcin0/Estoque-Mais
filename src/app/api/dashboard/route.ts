import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const [
        totalProdutos,
        produtosEstoqueBaixo,
        totalMovimentacoes,
        totalUsuarios,
        movimentacoesRecentes,
        produtosAlerta,
    ] = await Promise.all([
        prisma.product.count({ where: { ativo: true } }),
        prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM products
      WHERE ativo = true AND quantidade < estoque_minimo
    `.then((r) => Number(r[0].count)),
        prisma.stockMovement.count(),
        prisma.user.count({ where: { ativo: true } }),
        prisma.stockMovement.findMany({
            take: 5,
            orderBy: { criadoEm: "desc" },
            include: {
                produto: { select: { nome: true, sku: true } },
                usuario: { select: { nome: true } },
            },
        }),
        prisma.product.findMany({
            where: { ativo: true },
            orderBy: { quantidade: "asc" },
            take: 5,
        }),
    ]);

    const alertas = produtosAlerta.filter((p) => p.quantidade < p.estoqueMinimo);

    return NextResponse.json({
        totalProdutos,
        produtosEstoqueBaixo,
        totalMovimentacoes,
        totalUsuarios,
        movimentacoesRecentes,
        alertas,
    });
}
