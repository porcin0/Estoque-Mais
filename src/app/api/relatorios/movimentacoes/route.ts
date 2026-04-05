import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const movimentacoes = await prisma.stockMovement.findMany({
        orderBy: { criadoEm: "desc" },
        include: {
            produto: { select: { nome: true, sku: true } },
            usuario: { select: { nome: true } },
        },
    });

    return NextResponse.json(movimentacoes);
}
