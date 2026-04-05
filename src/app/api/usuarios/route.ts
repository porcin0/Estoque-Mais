import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "@/lib/audit";

// GET /api/usuarios
export async function GET() {
    const usuarios = await prisma.user.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            criadoEm: true,
        },
        orderBy: { criadoEm: "desc" },
    });

    return NextResponse.json(usuarios);
}

// POST /api/usuarios
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nome, email, senha, role } = body;

        if (!nome || !email || !senha) {
            return NextResponse.json(
                { error: "Campos obrigatórios: nome, email, senha" },
                { status: 400 }
            );
        }

        const existente = await prisma.user.findUnique({ where: { email } });
        if (existente) {
            return NextResponse.json(
                { error: "Já existe um usuário com este e-mail" },
                { status: 409 }
            );
        }

        const usuario = await prisma.user.create({
            data: {
                nome,
                email,
                senha,
                role: role || "OPERACIONAL",
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
            },
        });

        const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
        if (admin) {
            await registrarAuditoria({
                acao: "CADASTRO",
                entidade: "User",
                entidadeId: usuario.id,
                detalhes: `Usuário criado: ${usuario.nome} (${usuario.email}) - Perfil: ${usuario.role}`,
                usuarioId: admin.id,
            });
        }

        return NextResponse.json(usuario, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json(
            { error: "Erro ao criar usuário" },
            { status: 500 }
        );
    }
}
