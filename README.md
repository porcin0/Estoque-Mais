# Estoque+

Sistema web de controle de estoque para comércio, desenvolvido como projeto acadêmico da disciplina de Práticas Profissionais do curso de Análise e Desenvolvimento de Sistemas.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM**
- **PostgreSQL**
- **bcryptjs** (hash de senha)
- **lucide-react** (ícones)

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd projeto-prat-prof-ads

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
```


## Banco de Dados

```bash
# Criar as tabelas no banco
npx prisma migrate dev --name init

# Popular com dados de teste
npm run db:seed

# Abrir interface visual do banco (opcional)
npm run db:studio
```

## Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000/login`.

## Credenciais de teste

| Perfil       | E-mail                   | Senha       |
|-------------|--------------------------|-------------|
| Gerente     | admin@estoqueplus.com    | admin123    |
| Operacional | operador@estoqueplus.com | operador123 |

## Estrutura do projeto

```
src/
├── app/
│   ├── (dashboard)/     # páginas protegidas (layout com sidebar)
│   │   ├── page.tsx     # dashboard
│   │   ├── produtos/    # CRUD de produtos
│   │   ├── movimentacoes/ # entrada/saída de estoque
│   │   ├── usuarios/    # gestão de usuários (admin)
│   │   ├── relatorios/  # relatórios com exportação CSV
│   │   └── auditoria/   # logs de auditoria
│   ├── login/           # página de login
│   └── api/             # rotas da API REST
├── components/          # sidebar, header
├── lib/                 # prisma, auth (JWT), audit
└── middleware.ts        # proteção de rotas
prisma/
├── schema.prisma        # modelo do banco
└── seed.ts              # dados de teste
docs/                    # documentação do projeto
```


O comando de build já inclui `prisma generate`:
```bash
npm run build
```

Após o deploy, rode as migrations e o seed contra o banco de produção:
```bash
DATABASE_URL="url-do-banco-de-producao" npx prisma db push
DATABASE_URL="url-do-banco-de-producao" npm run db:seed
```

## Documentação

- [Guia do Usuário](docs/guia_do_usuario.md)
- [Acompanhamento da Iteração 1](docs/acompanhamento_iteracao1.md)
- [Diagrama de Implantação](docs/diagrama_implantacao.md)
- [Consultas SQL para Demonstração](docs/consultas_banco_demo.sql)
