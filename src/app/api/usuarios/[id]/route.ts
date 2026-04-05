import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/audit";

// GET /api/usuarios/[id]
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const usuario = await prisma.user.findUnique({
        where: { id },
        select: { id: true, nome: true, email: true, role: true, ativo: true },
    });

    if (!usuario) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
}

// PUT /api/usuarios/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { nome, email, senha, role, ativo } = body;

        if (email) {
            const existente = await prisma.user.findFirst({
                where: { email, NOT: { id } },
            });
            if (existente) {
                return NextResponse.json(
                    { error: "Já existe outro usuário com este e-mail" },
                    { status: 409 }
                );
            }
        }

        const updateData: Record<string, unknown> = {};
        if (nome !== undefined) updateData.nome = nome;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (ativo !== undefined) updateData.ativo = ativo;
        if (senha) updateData.senha = senha;

        const usuario = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, nome: true, email: true, role: true, ativo: true },
        });

        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) {
            await registrarAuditoria({
                acao: "EDICAO",
                entidade: "User",
                entidadeId: usuario.id,
                detalhes: `Usuário editado: ${usuario.nome} (${usuario.email})`,
                usuarioId: admin.id,
            });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        return NextResponse.json(
            { error: "Erro ao editar usuário" },
            { status: 500 }
        );
    }
}
