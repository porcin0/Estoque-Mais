import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/audit";

// GET /api/produtos/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const produto = await prisma.product.findUnique({ where: { id } });

    if (!produto) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(produto);
}

// PUT /api/produtos/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { nome, sku, descricao, categoria, estoqueMinimo, preco, ativo } = body;

        if (sku) {
            const existente = await prisma.product.findFirst({
                where: { sku, NOT: { id } },
            });
            if (existente) {
                return NextResponse.json(
                    { error: "Já existe outro produto com este SKU" },
                    { status: 409 }
                );
            }
        }

        const produto = await prisma.product.update({
            where: { id },
            data: {
                ...(nome !== undefined && { nome }),
                ...(sku !== undefined && { sku }),
                ...(descricao !== undefined && { descricao }),
                ...(categoria !== undefined && { categoria }),
                ...(estoqueMinimo !== undefined && { estoqueMinimo: parseInt(estoqueMinimo) }),
                ...(preco !== undefined && { preco: parseFloat(preco) }),
                ...(ativo !== undefined && { ativo }),
            },
        });

        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) {
            await registrarAuditoria({
                acao: "EDICAO",
                entidade: "Product",
                entidadeId: produto.id,
                detalhes: `Produto editado: ${produto.nome} (${produto.sku})`,
                usuarioId: admin.id,
            });
        }

        return NextResponse.json(produto);
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        return NextResponse.json(
            { error: "Erro ao editar produto" },
            { status: 500 }
        );
    }
}

// DELETE /api/produtos/[id]
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const produto = await prisma.product.update({
            where: { id },
            data: { ativo: false },
        });

        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) {
            await registrarAuditoria({
                acao: "EXCLUSAO",
                entidade: "Product",
                entidadeId: produto.id,
                detalhes: `Produto desativado: ${produto.nome} (${produto.sku})`,
                usuarioId: admin.id,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        return NextResponse.json(
            { error: "Erro ao excluir produto" },
            { status: 500 }
        );
    }
}
