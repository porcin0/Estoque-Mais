-- =============================================================
-- Estoque+ — Consultas SQL para demonstração em banca
-- =============================================================
-- Estas consultas podem ser executadas diretamente no banco
-- PostgreSQL via psql, pgAdmin, DBeaver ou Prisma Studio.
-- =============================================================

-- 1. Listar todos os produtos ativos
SELECT
  nome,
  sku,
  categoria,
  quantidade,
  estoque_minimo,
  preco,
  ativo
FROM products
WHERE ativo = true
ORDER BY nome;


-- 2. Produtos com estoque abaixo do mínimo (alerta)
SELECT
  nome,
  sku,
  quantidade AS "estoque_atual",
  estoque_minimo,
  (estoque_minimo - quantidade) AS "faltam"
FROM products
WHERE ativo = true
  AND quantidade < estoque_minimo
ORDER BY (estoque_minimo - quantidade) DESC;


-- 3. Todas as movimentações com nome do produto e responsável
SELECT
  sm.criado_em AS "data_hora",
  sm.tipo,
  p.nome AS "produto",
  p.sku,
  sm.quantidade,
  u.nome AS "responsavel",
  sm.observacao
FROM stock_movements sm
JOIN products p ON p.id = sm.produto_id
JOIN users u ON u.id = sm.usuario_id
ORDER BY sm.criado_em DESC;


-- 4. Movimentações de um produto específico (exemplo: ALM-001)
SELECT
  sm.criado_em AS "data_hora",
  sm.tipo,
  sm.quantidade,
  u.nome AS "responsavel",
  sm.observacao
FROM stock_movements sm
JOIN products p ON p.id = sm.produto_id
JOIN users u ON u.id = sm.usuario_id
WHERE p.sku = 'ALM-001'
ORDER BY sm.criado_em DESC;


-- 5. Logs de auditoria com nome do usuário
SELECT
  al.criado_em AS "data_hora",
  al.acao,
  al.entidade,
  al.detalhes,
  u.nome AS "usuario",
  u.email
FROM audit_logs al
JOIN users u ON u.id = al.usuario_id
ORDER BY al.criado_em DESC;


-- 6. Logs de auditoria filtrados por ação (ex: entradas de estoque)
SELECT
  al.criado_em AS "data_hora",
  al.detalhes,
  u.nome AS "usuario"
FROM audit_logs al
JOIN users u ON u.id = al.usuario_id
WHERE al.acao = 'ENTRADA_ESTOQUE'
ORDER BY al.criado_em DESC;


-- 7. Resumo de movimentações por produto
SELECT
  p.nome,
  p.sku,
  p.quantidade AS "estoque_atual",
  COUNT(CASE WHEN sm.tipo = 'ENTRADA' THEN 1 END) AS "total_entradas",
  COALESCE(SUM(CASE WHEN sm.tipo = 'ENTRADA' THEN sm.quantidade END), 0) AS "qtd_entrada",
  COUNT(CASE WHEN sm.tipo = 'SAIDA' THEN 1 END) AS "total_saidas",
  COALESCE(SUM(CASE WHEN sm.tipo = 'SAIDA' THEN sm.quantidade END), 0) AS "qtd_saida"
FROM products p
LEFT JOIN stock_movements sm ON sm.produto_id = p.id
GROUP BY p.id, p.nome, p.sku, p.quantidade
ORDER BY p.nome;


-- 8. Verificar alteração de estoque (comparar antes e depois)
-- Esta consulta mostra o estoque atual e o saldo calculado das movimentações
SELECT
  p.nome,
  p.sku,
  p.quantidade AS "estoque_registrado",
  COALESCE(SUM(CASE WHEN sm.tipo = 'ENTRADA' THEN sm.quantidade ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN sm.tipo = 'SAIDA' THEN sm.quantidade ELSE 0 END), 0)
  AS "saldo_movimentacoes"
FROM products p
LEFT JOIN stock_movements sm ON sm.produto_id = p.id
GROUP BY p.id, p.nome, p.sku, p.quantidade
ORDER BY p.nome;


-- 9. Usuários cadastrados no sistema
SELECT
  nome,
  email,
  role AS "perfil",
  ativo,
  criado_em
FROM users
ORDER BY criado_em;


-- 10. Total de ações por usuário (auditoria)
SELECT
  u.nome,
  u.email,
  COUNT(al.id) AS "total_acoes"
FROM users u
LEFT JOIN audit_logs al ON al.usuario_id = u.id
GROUP BY u.id, u.nome, u.email
ORDER BY total_acoes DESC;
