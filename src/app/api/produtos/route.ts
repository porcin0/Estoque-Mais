import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/audit";

// GET /api/produtos — listar produtos
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get("busca") || "";
    const categoria = searchParams.get("categoria") || "";

    const where: Record<string, unknown> = {};
    if (busca) {
        where.OR = [
            { nome: { contains: busca, mode: "insensitive" } },
            { sku: { contains: busca, mode: "insensitive" } },
        ];
    }
    if (categoria) {
        where.categoria = categoria;
    }

    const produtos = await prisma.product.findMany({
        where,
        orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(produtos);
}

// POST /api/produtos — criar produto
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nome, sku, descricao, categoria, quantidade, estoqueMinimo, preco } = body;

        if (!nome || !sku || !categoria || preco === undefined) {
            return NextResponse.json(
                { error: "Campos obrigatórios: nome, sku, categoria, preco" },
                { status: 400 }
            );
        }

        const existente = await prisma.product.findUnique({ where: { sku } });
        if (existente) {
            return NextResponse.json(
                { error: "Já existe um produto com este SKU" },
                { status: 409 }
            );
        }

        const produto = await prisma.product.create({
            data: {
                nome,
                sku,
                descricao: descricao || null,
                categoria,
                quantidade: quantidade || 0,
                estoqueMinimo: estoqueMinimo || 5,
                preco: parseFloat(preco),
            },
        });

        // Usa o primeiro usuário admin como responsável no log
        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) {
            await registrarAuditoria({
                acao: "CADASTRO",
                entidade: "Product",
                entidadeId: produto.id,
                detalhes: `Produto criado: ${produto.nome} (${produto.sku})`,
                usuarioId: admin.id,
            });
        }

        return NextResponse.json(produto, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return NextResponse.json(
            { error: "Erro ao criar produto" },
            { status: 500 }
        );
    }
}
