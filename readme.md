# Sistema de Cadastro e Gerenciamento de Usuários

Aplicação web full-stack desenvolvida para cadastro, autenticação e controle de acesso de usuários (comum e administrador), utilizando **HTML5**, **CSS3**, **JavaScript Vanilla** e **Supabase (PostgreSQL)**.

🔗 **Acesse o projeto online:** [sistema-usuarios-81fmkij47-marcus-dev3.vercel.app](https://sistema-usuarios-81fmkij47-marcus-dev3.vercel.app/)

---

## Sobre o Projeto e Aprendizado

Este é o **meu primeiro projeto integrado a um banco de dados real**. O desenvolvimento contou com o auxílio de Inteligência Artificial como guia técnico durante a construção.

Por ser minha primeira experiência conectando um front-end a um serviço de banco de dados e autenticação, este projeto teve um foco maior no **aprendizado teórico e conceitual** do que na escrita autônoma de código do zero — permitindo compreender na prática como funcionam:
- O fluxo de autenticação (`signUp`, `signIn`, `signOut` e persistência de sessão);
- A relação entre a tabela de autenticação (`auth.users`) e uma tabela pública de perfis (`perfis`) no PostgreSQL;
- Políticas de segurança a nível de linha (**RLS — Row Level Security**) no Supabase;
- A comunicação assíncrona (`async/await`) entre o JavaScript no navegador e a API do banco de dados.

---

## Funcionalidades

- **Autenticação completa:** Cadastro e login com alternância dinâmica entre as telas e persistência de sessão ao recarregar a página (`F5`).
- **Validação de senha em tempo real:** Verificação visual instantânea de tamanho mínimo (8 caracteres), letras maiúsculas e minúsculas, números, símbolos e bloqueio de senhas comuns (`senha`, `123456`), além de botão para mostrar/ocultar senha.
- **Área do Usuário Comum:** Exibição personalizada de nome, gênero e idade calculada automaticamente a partir da data de nascimento.
- **Painel do Administrador:**
  - Listagem de todos os usuários cadastrados;
  - Filtro dinâmico por gênero (`Todos`, `Homem`, `Mulher`);
  - Promoção de usuários comuns para administradores diretamente pela interface.
- **Interface Responsiva:** Layout moderno em tema escuro adaptável para desktop e dispositivos móveis.

---

## Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (ES6+)
- **Back-end / BaaS:** [Supabase](https://supabase.com/) (Authentication & PostgreSQL Database)
- **Hospedagem:** [Vercel](https://vercel.com/)

---

## Estrutura de Arquivos

```text
sistema-usuarios/
├── front-end/
│   ├── index.html       # Estrutura das telas (Auth, Perfil e Painel Admin)
│   ├── style.css        # Estilização em tema escuro e responsividade
│   └── js/
│       └── script.js    # Regras de validação, DOM e integração com Supabase
└── README.md
