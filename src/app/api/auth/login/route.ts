import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, senha } = await request.json();

        if (!email || !senha) {
            return NextResponse.json(
                { error: "E-mail e senha são obrigatórios" },
                { status: 400 }
            );
        }

        const usuario = await prisma.user.findUnique({
            where: { email },
            select: { id: true, nome: true, email: true, role: true, ativo: true, senha: true },
        });

        if (!usuario || usuario.senha !== senha) {
            return NextResponse.json(
                { error: "E-mail ou senha inválidos" },
                { status: 401 }
            );
        }

        if (!usuario.ativo) {
            return NextResponse.json(
                { error: "Usuário desativado" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return NextResponse.json(
            { error: "Erro ao realizar login" },
            { status: 500 }
        );
    }
}
