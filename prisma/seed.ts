import { PrismaClient, UserRole, MovementType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Limpando dados existentes...");
    await prisma.auditLog.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log("Criando usuários...");

    const admin = await prisma.user.create({
        data: {
            nome: "Carlos Gerente",
            email: "admin@estoqueplus.com",
            senha: "admin123",
            role: UserRole.ADMIN,
        },
    });

    const operador = await prisma.user.create({
        data: {
            nome: "Ana Operadora",
            email: "operador@estoqueplus.com",
            senha: "operador123",
            role: UserRole.OPERACIONAL,
        },
    });

    console.log("Criando produtos...");
    const produtos = await Promise.all([
        prisma.product.create({
            data: {
                nome: "Arroz Integral 5kg",
                sku: "ALM-001",
                descricao: "Arroz integral tipo 1, pacote 5kg",
                categoria: "Alimentos",
                quantidade: 45,
                estoqueMinimo: 10,
                preco: 24.9,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Feijão Carioca 1kg",
                sku: "ALM-002",
                descricao: "Feijão carioca tipo 1, pacote 1kg",
                categoria: "Alimentos",
                quantidade: 3,
                estoqueMinimo: 15,
                preco: 8.5,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Óleo de Soja 900ml",
                sku: "ALM-003",
                descricao: "Óleo de soja refinado, garrafa 900ml",
                categoria: "Alimentos",
                quantidade: 30,
                estoqueMinimo: 10,
                preco: 7.9,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Detergente Neutro 500ml",
                sku: "LIM-001",
                descricao: "Detergente líquido neutro, frasco 500ml",
                categoria: "Limpeza",
                quantidade: 60,
                estoqueMinimo: 20,
                preco: 2.5,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Água Sanitária 1L",
                sku: "LIM-002",
                descricao: "Água sanitária, frasco 1 litro",
                categoria: "Limpeza",
                quantidade: 8,
                estoqueMinimo: 15,
                preco: 4.2,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Papel Toalha 2 Rolos",
                sku: "LIM-003",
                descricao: "Papel toalha absorvente, pacote 2 rolos",
                categoria: "Limpeza",
                quantidade: 25,
                estoqueMinimo: 10,
                preco: 6.8,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Caderno Universitário 200fl",
                sku: "PAP-001",
                descricao: "Caderno espiral 200 folhas, capa dura",
                categoria: "Papelaria",
                quantidade: 40,
                estoqueMinimo: 5,
                preco: 18.9,
            },
        }),
        prisma.product.create({
            data: {
                nome: "Caneta Esferográfica Azul",
                sku: "PAP-002",
                descricao: "Caneta esferográfica ponta média, azul (cx 12 unidades)",
                categoria: "Papelaria",
                quantidade: 2,
                estoqueMinimo: 5,
                preco: 15.0,
            },
        }),
    ]);

    console.log("Criando movimentações...");
    const movimentacoes = [
        { produtoIndex: 0, tipo: MovementType.ENTRADA, quantidade: 50, obs: "Compra fornecedor ABC", usuario: admin },
        { produtoIndex: 0, tipo: MovementType.SAIDA, quantidade: 5, obs: "Venda balcão", usuario: operador },
        { produtoIndex: 1, tipo: MovementType.ENTRADA, quantidade: 20, obs: "Reposição mensal", usuario: admin },
        { produtoIndex: 1, tipo: MovementType.SAIDA, quantidade: 17, obs: "Venda atacado", usuario: operador },
        { produtoIndex: 3, tipo: MovementType.ENTRADA, quantidade: 100, obs: "Compra fornecedor XYZ", usuario: admin },
        { produtoIndex: 3, tipo: MovementType.SAIDA, quantidade: 40, obs: "Distribuição interna", usuario: operador },
        { produtoIndex: 4, tipo: MovementType.SAIDA, quantidade: 7, obs: "Venda varejo", usuario: operador },
        { produtoIndex: 7, tipo: MovementType.SAIDA, quantidade: 3, obs: "Venda varejo", usuario: operador },
    ];

    for (const mov of movimentacoes) {
        await prisma.stockMovement.create({
            data: {
                tipo: mov.tipo,
                quantidade: mov.quantidade,
                observacao: mov.obs,
                produtoId: produtos[mov.produtoIndex].id,
                usuarioId: mov.usuario.id,
            },
        });
    }

    console.log("Criando logs de auditoria...");
    const logs = [
        { acao: "CADASTRO", entidade: "Product", entidadeId: produtos[0].id, detalhes: `Produto criado: ${produtos[0].nome}`, usuarioId: admin.id },
        { acao: "CADASTRO", entidade: "Product", entidadeId: produtos[1].id, detalhes: `Produto criado: ${produtos[1].nome}`, usuarioId: admin.id },
        { acao: "ENTRADA_ESTOQUE", entidade: "StockMovement", detalhes: `Entrada de 50 unidades - ${produtos[0].nome}`, usuarioId: admin.id },
        { acao: "SAIDA_ESTOQUE", entidade: "StockMovement", detalhes: `Saída de 5 unidades - ${produtos[0].nome}`, usuarioId: operador.id },
        { acao: "SAIDA_ESTOQUE", entidade: "StockMovement", detalhes: `Saída de 17 unidades - ${produtos[1].nome}`, usuarioId: operador.id },
        { acao: "EDICAO", entidade: "Product", entidadeId: produtos[3].id, detalhes: `Produto editado: ${produtos[3].nome}`, usuarioId: admin.id },
    ];

    for (const log of logs) {
        await prisma.auditLog.create({ data: log });
    }

    console.log("Seed concluído!");
    console.log(`  - ${2} usuários criados`);
    console.log(`  - ${produtos.length} produtos criados`);
    console.log(`  - ${movimentacoes.length} movimentações criadas`);
    console.log(`  - ${logs.length} logs de auditoria criados`);
}

main()
    .catch((e) => {
        console.error("Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
