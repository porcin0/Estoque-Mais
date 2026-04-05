# Acompanhamento — Iteração 1

## Objetivo

Entregar uma versão funcional do sistema Estoque+ com as funcionalidades essenciais: autenticação, CRUD de produtos, movimentações de estoque, gestão de usuários, auditoria e relatórios.

O foco é ter software executável com persistência em banco de dados, pronto para demonstração e deploy.

## Escopo definido para a Iteração 1

- Login com dois perfis (gerente e operacional)
- Dashboard com resumo
- CRUD de produtos com alerta de estoque baixo
- Movimentações de entrada e saída com atualização automática do estoque
- Gestão de usuários (gerente)
- Auditoria com registro de ações
- Relatórios com exportação CSV
- Documentação de apoio

## Funcionalidades implementadas

### Concluído

- [x] Autenticação por e-mail e senha (JWT + cookie httpOnly)
- [x] Middleware de proteção de rotas
- [x] Perfis de acesso (ADMIN e OPERACIONAL) com restrição de telas
- [x] Layout com sidebar e navegação por perfil
- [x] Dashboard com cards de resumo, movimentações recentes e alertas de estoque baixo
- [x] Listagem de produtos com busca, indicador de estoque baixo e status
- [x] Cadastro e edição de produtos
- [x] Desativação (soft delete) de produtos
- [x] Registro de movimentações (entrada/saída) com atualização transacional do estoque
- [x] Validação de estoque insuficiente em saídas
- [x] Histórico de movimentações com filtro por tipo
- [x] Listagem de usuários
- [x] Cadastro de usuários com perfil
- [x] Ativação/desativação de usuários
- [x] Registro automático de auditoria (login, CRUD, movimentações)
- [x] Tela de auditoria com paginação
- [x] Relatórios com exportação CSV (produtos e movimentações)
- [x] Seed com dados de teste
- [x] Schema Prisma completo
- [x] README com instruções de instalação e deploy
- [x] Guia do usuário
- [x] Diagrama de implantação
- [x] Consultas SQL para demonstração em banca

### Não implementado (previsto para próximas iterações)

- [ ] Recuperação de senha
- [ ] Edição de perfil próprio
- [ ] Filtros avançados nos relatórios (por data, categoria)
- [ ] Gráficos no dashboard
- [ ] Paginação em todas as listagens
- [ ] Testes automatizados
- [ ] Notificações por e-mail

## Decisões técnicas


- **jose** para manipulação de JWT, pois funciona tanto no Node quanto no Edge Runtime do middleware do Next.js.
- **Soft delete** para produtos (campo `ativo`), em vez de exclusão real, para preservar integridade das movimentações já registradas.
- **Transação no Prisma** para movimentações, garantindo que a criação da movimentação e a atualização do estoque aconteçam de forma atômica.
- **Audit log simplificado** guardando ação, entidade, detalhes e usuário. Suficiente para rastreabilidade sem complexidade excessiva.
- **CSV com separador `;` e BOM UTF-8** para compatibilidade com Excel em português.
- **Tailwind CSS v4** com tema customizado via `@theme` — cores consistentes em todo o sistema.

## Dificuldades encontradas

- Middleware do Next.js roda no Edge Runtime, o que impede uso de bibliotecas Node puras (como jsonwebtoken). Resolvido com a lib `jose`.
- Tailwind v4 mudou a forma de configurar temas (sem `tailwind.config.ts`), usando `@theme` direto no CSS.
- Manter consistência entre soft delete de produtos e listagem de movimentações — movimentações precisam continuar referenciando produtos desativados.

## Próximos passos (Iteração 2)

- Filtros por data nos relatórios e movimentações
- Dashboard com gráficos (ex: movimentações por dia, categorias)
- Edição de perfil e troca de senha
- Paginação na listagem de produtos e movimentações
- Testes automatizados (pelo menos nos endpoints da API)
- Tratamento de erros mais detalhado
- Logs com mais informações (IP, user-agent)

## Sugestão de kanban

### Concluído
- Autenticação e proteção de rotas
- Dashboard
- CRUD de produtos
- Movimentações de estoque
- Gestão de usuários
- Auditoria
- Relatórios com CSV
- Documentação (README, guia, diagrama, SQL)

### Em andamento
- Testes manuais e ajustes finais

### Pendente
- Filtros avançados por data
- Gráficos no dashboard
- Edição de perfil
- Paginação em todas as telas
- Testes automatizados
- Deploy em ambiente de produção
