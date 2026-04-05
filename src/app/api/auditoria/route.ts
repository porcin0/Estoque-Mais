import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pagina = parseInt(searchParams.get("pagina") || "1");
    const porPagina = 20;

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            skip: (pagina - 1) * porPagina,
            take: porPagina,
            orderBy: { criadoEm: "desc" },
            include: {
                usuario: { select: { nome: true, email: true } },
            },
        }),
        prisma.auditLog.count(),
    ]);

    return NextResponse.json({
        logs,
        total,
        pagina,
        totalPaginas: Math.ceil(total / porPagina),
    });
}
