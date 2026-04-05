import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const produtos = await prisma.product.findMany({
        orderBy: { nome: "asc" },
    });

    return NextResponse.json(produtos);
}
