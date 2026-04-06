# Roteiro de Apresentação — Estoque+ (~8 minutos)

---

## 🎬 PARTE 1 — Introdução (≈1 min)

> Bom dia/boa tarde, professor(a). Vou apresentar o **Estoque+**, um sistema web de gerenciamento de estoque inteligente, desenvolvido com Next.js, TypeScript, Tailwind CSS, Prisma ORM e PostgreSQL hospedado no Neon.
>
> O sistema implementa **controle de acesso baseado em perfis (RBAC)** com dois níveis: **Gerente** e **Operacional**. Cada perfil tem permissões diferentes dentro do sistema.
>
> O deploy foi feito na **Vercel**, então está acessível online. Vou demonstrar todas as funcionalidades agora.

---

## 🔐 PARTE 2 — Tela de Login + RBAC (≈1 min)

> Aqui temos a **tela de login**. Como podem ver, ela exibe o logo do sistema e as credenciais de demonstração para facilitar os testes.
>
> O sistema possui **dois perfis de acesso**:
> - O **Gerente** (admin@estoqueplus.com) tem acesso total ao sistema
> - O **Operacional** (operador@estoqueplus.com) tem acesso restrito — ele não vê as abas de Usuários, Auditoria, e nem o relatório de movimentações
>
> Vou logar primeiro como **Gerente** para mostrar todas as funcionalidades.

**[AÇÃO: Digitar admin@estoqueplus.com / admin123 e clicar em Entrar]**

---

## 📊 PARTE 3 — Dashboard (≈1 min)

> Após o login, caímos no **Dashboard**, que é a visão geral do sistema.
>
> Aqui no topo temos **quatro cards de resumo**:
> - **Produtos Ativos** — total de produtos cadastrados
> - **Estoque Baixo** — quantidade de produtos com estoque abaixo do mínimo, que fica em vermelho quando tem algum
> - **Movimentações** — total de entradas e saídas realizadas
> - **Usuários Ativos** — quantos usuários estão no sistema
>
> Logo abaixo temos duas seções:
> - **Movimentações Recentes** — as últimas entradas e saídas com setas verdes (entrada) e vermelhas (saída)
> - **Alertas de Estoque Baixo** — lista os produtos que estão abaixo do estoque mínimo configurado, para que o gestor tome providências

---

## 📦 PARTE 4 — Produtos (CRUD Completo) (≈1.5 min)

> Agora vou para a aba **Produtos**. Aqui temos a listagem com todos os produtos cadastrados em formato de tabela.
>
> Reparem que temos: nome, SKU, categoria, quantidade em estoque com o mínimo ao lado, preço e status. Os produtos com estoque baixo aparecem com um **ícone de alerta** ao lado do nome.
>
> Temos também um campo de **busca** que filtra em tempo real por nome, SKU ou categoria.

**[AÇÃO: Digitar algo no campo de busca e mostrar a filtragem]**

> Vou **cadastrar um novo produto**. Clico em "Novo Produto".

**[AÇÃO: Clicar em "Novo Produto" e preencher o formulário]**

> Preencho o nome, SKU, categoria, descrição, quantidade inicial, estoque mínimo e preço. Ao salvar, ele aparece na listagem.

**[AÇÃO: Salvar e mostrar na lista]**

> Posso também **editar** um produto clicando no ícone de lápis, ou **desativá-lo** clicando no ícone de lixeira. A desativação é um soft delete — o produto não é excluído do banco, apenas fica inativo.

**[AÇÃO: Mostrar rápido o botão de editar e o de desativar]**

---

## 🔄 PARTE 5 — Movimentações de Estoque (≈1 min)

> Na aba **Movimentações**, temos o histórico completo de entradas e saídas de estoque.
>
> Cada registro mostra: o tipo (entrada ou saída com cores distintas), o produto, a quantidade, quem fez, quando e uma observação opcional.

> Vou registrar uma **nova movimentação**. Clico em "Nova Movimentação".

**[AÇÃO: Clicar em "Nova Movimentação"]**

> Seleciono o produto, escolho o tipo — **Entrada** para repor estoque ou **Saída** para dar baixa. Defino a quantidade e uma observação.
>
> O sistema faz uma **atualização transacional** — ele atualiza o estoque do produto automaticamente. Se eu tentar fazer uma saída maior do que o estoque disponível, ele bloqueia e exibe um erro.

**[AÇÃO: Preencher e salvar. Mostrar que o estoque atualizou voltando em Produtos]**

---

## 👥 PARTE 6 — Gestão de Usuários (Gerente Only) (≈0.5 min)

> A aba **Usuários** é exclusiva do perfil Gerente. Aqui é possível ver todos os usuários do sistema, criar novos e ativar/desativar contas.
>
> Cada usuário tem nome, e-mail, perfil (Gerente ou Operacional) e status.
>
> Posso **ativar ou desativar** um usuário pelo botão de ação. O usuário desativado não consegue fazer login.

**[AÇÃO: Mostrar a listagem e clicar no botão de desativar/ativar rapidamente]**

---

## 📄 PARTE 7 — Relatórios com Exportação CSV (≈0.5 min)

> Na aba **Relatórios**, o Gerente tem acesso a dois tipos de exportação em CSV:
> - **Produtos** — exporta a lista completa com nome, SKU, categoria, quantidade, preço e status
> - **Movimentações** — exporta o histórico com data, tipo, produto, quantidade e responsável
>
> Os arquivos são gerados com **BOM UTF-8** para abrir corretamente no Excel, inclusive com acentos.

**[AÇÃO: Clicar em "Exportar CSV" em Produtos e abrir o arquivo rapidamente]**

---

## 🛡️ PARTE 8 — Auditoria (Gerente Only) (≈0.5 min)

> A aba **Auditoria** registra automaticamente todas as ações feitas no sistema: cadastros, edições, exclusões, entradas e saídas de estoque.
>
> Cada registro mostra a data/hora, o tipo de ação com cores diferentes, a entidade afetada, os detalhes e quem realizou.
>
> A listagem é **paginada** para não sobrecarregar o sistema.

**[AÇÃO: Navegar pela listagem e mostrar a paginação]**

---

## 🔒 PARTE 9 — Demonstração do RBAC (≈1 min)

> Agora vou demonstrar o **controle de acesso** na prática. Vou clicar em "Sair" e logar como a **operadora Ana**.

**[AÇÃO: Clicar em Sair → Logar com operador@estoqueplus.com / operador123]**

> Reparem que agora a **sidebar** do sistema está diferente:
> - As abas **Usuários** e **Auditoria** **desapareceram** — a operadora não tem acesso a essas funcionalidades
> - Na aba **Relatórios**, ela só vê o export de **Produtos**, sem acesso ao relatório de movimentações
>
> Ela consegue normalmente acessar Dashboard, Produtos e Movimentações — que são as funções do dia a dia operacional.
>
> Esse controle é feito tanto no **frontend** (escondendo os links) quanto com **proteção na página** — se ela tentar acessar /usuarios pela URL, é redirecionada automaticamente.

---

## 🏁 PARTE 10 — Encerramento (≈0.5 min)

> Para resumir, o **Estoque+** é um sistema completo de controle de estoque com:
> - **CRUD de produtos** com busca e alertas de estoque baixo
> - **Movimentações** com atualização transacional do estoque  
> - **Controle de acesso (RBAC)** com dois perfis
> - **Auditoria** automática de todas as ações
> - **Relatórios** exportáveis em CSV
> - **Dashboard** com visão gerencial
>
> As tecnologias utilizadas foram **Next.js 15** com App Router, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM** e **PostgreSQL** no **Neon**, com deploy na **Vercel**.
>
> É isso, obrigado!
