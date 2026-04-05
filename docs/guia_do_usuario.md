# Guia do Usuário — Estoque+

## O que é o Estoque+

O Estoque+ é um sistema web de controle de estoque para comércio. Ele permite cadastrar produtos, registrar entradas e saídas, acompanhar o nível de estoque e gerar relatórios.

O sistema tem dois perfis de acesso com permissões diferentes.

## Como acessar

Abra o navegador e acesse o endereço do sistema (em desenvolvimento local: `http://localhost:3000/login`).

Você será direcionado para a tela de login.

## Login

Informe seu e-mail e senha para entrar no sistema. Após autenticação, você será direcionado ao Dashboard.

Credenciais de demonstração:

- **Gerente:** admin@estoqueplus.com / admin123
- **Operacional:** operador@estoqueplus.com / operador123

## Perfis de acesso

### Gerente (Administrador)

Tem acesso completo ao sistema:
- Dashboard
- Produtos (cadastrar, editar, desativar)
- Movimentações (registrar entrada e saída)
- Usuários (cadastrar, ativar/desativar)
- Relatórios (exportar CSV)
- Auditoria (consultar logs)

### Operacional

Acesso restrito:
- Dashboard
- Produtos (somente consulta)
- Movimentações (registrar entrada e saída)

O operacional **não** tem acesso a usuários, relatórios e auditoria, e **não** pode cadastrar, editar ou excluir produtos.

## Funcionalidades

### Dashboard

Tela inicial com resumo geral:
- Total de produtos ativos
- Quantidade de produtos com estoque baixo (abaixo do mínimo definido)
- Total de movimentações registradas
- Total de usuários ativos
- Lista das movimentações mais recentes
- Alertas de produtos com estoque baixo

### Produtos

Lista todos os produtos cadastrados com nome, SKU, categoria, estoque, preço e status.

- Um **ícone de alerta** (triângulo amarelo/vermelho) aparece ao lado de produtos com estoque abaixo do mínimo
- O campo de busca permite filtrar por nome, SKU ou categoria
- O gerente pode:
  - **Novo Produto:** cadastrar com nome, SKU, descrição, categoria, preço, quantidade inicial e estoque mínimo
  - **Editar:** alterar dados do produto (ícone de lápis)
  - **Desativar:** marcar produto como inativo (ícone de lixeira) — o produto não é apagado do banco

### Movimentações

Histórico de entradas e saídas de estoque.

- É possível filtrar por tipo (Entrada / Saída)
- Para registrar uma nova movimentação:
  1. Clique em "Nova Movimentação"
  2. Selecione o produto
  3. Escolha o tipo (Entrada ou Saída)
  4. Informe a quantidade
  5. Adicione uma observação (opcional)
  6. Clique em "Registrar Movimentação"

A quantidade em estoque do produto é atualizada automaticamente. O sistema não permite saída maior que o estoque disponível.

### Usuários (somente gerente)

Lista os usuários cadastrados com nome, e-mail, perfil e status.

- Para cadastrar um novo usuário, clique em "Novo Usuário" e preencha nome, e-mail, senha e perfil
- Para ativar ou desativar um usuário, clique no ícone de ação na linha do usuário

### Relatórios (somente gerente)

Permite exportar dados em formato CSV:

- **Relatório de Produtos:** exporta todos os produtos com nome, SKU, categoria, quantidade, estoque mínimo, preço e status
- **Relatório de Movimentações:** exporta todas as movimentações com data, tipo, produto, quantidade, responsável e observação

O arquivo CSV abre corretamente em Excel e LibreOffice (usa separador `;` e codificação UTF-8 com BOM).

### Auditoria (somente gerente)

Registra automaticamente as ações realizadas no sistema:

- Login de usuário
- Cadastro, edição e exclusão de produto
- Entrada e saída de estoque
- Cadastro e edição de usuário

A listagem é paginada e mostra data/hora, tipo de ação, entidade afetada, detalhes e o usuário que realizou a ação.

## Navegação

O sistema usa um menu lateral (sidebar) à esquerda. O menu exibe apenas as opções disponíveis para o perfil do usuário logado.

Para sair do sistema, clique em "Sair" no final do menu lateral.

## Limitações desta versão (Iteração 1)

- Não há recuperação de senha
- Não há edição do próprio perfil
- Não há filtros avançados nos relatórios (por data, categoria etc.)
- A paginação existe apenas na auditoria
- Não há gráficos no dashboard
- Não há controle de sessões simultâneas
- O sistema não envia notificações por e-mail

Essas funcionalidades podem ser implementadas em iterações futuras.
