# Guia do Usuário — Estoque+

O **Estoque+** é uma solução moderna e intuitiva para o gerenciamento de inventário, projetada para facilitar o controle de entradas, saídas e monitoramento de produtos em tempo real.

---

## 1. Como Acessar a Aplicação

Pode ser acessada de duas formas:

### 1.1. Versão Online (Recomendado)
A aplicação está hospedada na Vercel e pode ser acessada diretamente pelo navegador:
> **URL:** [https://estoque-mais-porcin0.vercel.app/](https://estoque-mais-porcin0.vercel.app/)

### 1.2. Instalação Local (Para Avaliação Técnica)
Caso deseje rodar a aplicação em sua própria máquina, siga os passos abaixo:

1.  **Pré-requisitos**: Ter o [Node.js](https://nodejs.org/) (v20+) instalado.
2.  **Clone o Repositório**:
    ```bash
    git clone https://github.com/porcin0/Estoque-Mais.git
    cd Estoque-Mais
    ```
3.  **Instale as Dependências**:
    ```bash
    npm install
    ```
4.  **Configure as Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto com a URL do banco de dados PostgreSQL (fale com o administrador para obter a `DATABASE_URL`).
5.  **Inicie o Servidor**:
    ```bash
    npm run dev
    ```
6.  **Acesse**: `http://localhost:3000`

---

## 2. Primeiros Passos: Login e Segurança

Ao acessar o sistema, você verá a tela de autenticação. O **Estoque+** utiliza um sistema de **Controle de Acesso Baseado em Perfis (RBAC)**.

### Perfil: Gerente
Possui acesso total a todas as ferramentas de gestão, usuários e auditoria.
- **E-mail**: `admin@estoqueplus.com`
- **Senha**: `admin123`

### Perfil: Operacional
Possui acesso restrito apenas às operações básicas de estoque (consulta e movimentação).
- **E-mail**: `operador@estoqueplus.com`
- **Senha**: `operador123`

---

## 3. Funcionalidades Detalhadas

### 3.1. Dashboard (Visão Geral)
A primeira tela ao logar apresenta um resumo crítico do negócio:
- **Indicadores Rápidos**: Total de produtos, alertas de estoque baixo, volume de movimentações e usuários ativos.
- **Movimentações Recentes**: Lista cronológica das últimas 5 ações de estoque.
- **Alertas de Reposição**: Lista prioritária de produtos que atingiram o nível mínimo de segurança.

### 3.2. Catálogo de Produtos
Localizado no menu **Produtos**, permite a gestão do inventário:
- **Busca Inteligente**: Filtre produtos por nome, SKU ou categoria instantaneamente.
- **Alertas Visuais**: Produtos com estoque baixo são destacados com um ícone de alerta ⚠️.
- **Gestão (Gerente)**: Apenas gerentes podem cadastrar novos produtos, editar informações existentes ou desativar itens do catálogo.

### 3.3. Movimentações de Estoque
A funcionalidade mais importante para o dia a dia:
1.  Acesse o menu **Movimentações**.
2.  Clique em **"Nova Movimentação"**.
3.  Escolha o produto e o tipo (**Entrada** para reposição, **Saída** para vendas/baixas).
4.  O sistema atualiza o saldo do produto automaticamente e gera um registro histórico.
> **Nota**: O sistema bloqueia saídas que deixariam o saldo negativo.

### 3.4. Relatórios e Exportação (Gerente)
Para análise de dados e contabilidade:
- Acesse o menu **Relatórios**.
- Clique em **"Exportar CSV"**.
- O sistema gera arquivos compatíveis com Excel e Google Sheets com codificação correta para nomes e acentos brasileiros.

### 3.5. Gestão de Usuários (Gerente)
Controle quem acessa o sistema:
- Liste todos os colaboradores.
- Ative ou desative acessos instantaneamente.
- Defina as permissões de cada conta.

### 3.6. Auditoria (Gerente)
Segurança e rastreabilidade:
- Registro de **quem** fez, **o que** fez e **quando** fez.
- Monitoramento de logins, entradas e saídas e alterações cadastrais.

---

## 4. Dicas de Uso

- **Saída Segura**: Sempre utilize o botão **"Sair"** no menu lateral ao finalizar seu trabalho, especialmente em computadores compartilhados.
- **Estoque Mínimo**: Configure bem o "Estoque Mínimo" de cada produto para que o sistema possa te avisar com antecedência quando for hora de comprar mais.
- **Busca por SKU**: Use o leitor de código de barras no campo de busca para encontrar produtos rapidamente (se configurado com o SKU correto).

---
*Estoque+ — Controle Total, Gestão Inteligente.*
