import { prisma } from "./prisma";

interface AuditParams {
    acao: string;
    entidade: string;
    entidadeId?: string;
    detalhes?: string;
    usuarioId: string;
}

export async function registrarAuditoria(params: AuditParams) {
    try {
        await prisma.auditLog.create({
            data: {
                acao: params.acao,
                entidade: params.entidade,
                entidadeId: params.entidadeId,
                detalhes: params.detalhes,
                usuarioId: params.usuarioId,
            },
        });
    } catch (error) {
        // Log no console para não travar a operação principal
        console.error("Erro ao registrar auditoria:", error);
    }
}
