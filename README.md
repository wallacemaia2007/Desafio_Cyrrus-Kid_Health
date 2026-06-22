# 🧒 KidHealth — Desafio Cyrrus

> Plataforma de acompanhamento da vacinação infantil desenvolvida como solução para o desafio técnico da Cyrrus.

---

## 📋 Sobre o Projeto

O **KidHealth** é um módulo de acompanhamento da jornada de vacinação infantil, pensado para substituir parcialmente a dependência da carteira física de vacinação. A solução permite que pais e responsáveis acompanhem de forma simples, visual e intuitiva a situação vacinal de cada filho.

---

## ✅ Cenários Atendidos

| Cenário | Descrição                                               | Solução implementada                                                                   |
| ------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **1**   | Identificar vacinas realizadas e pendentes por criança  | Carteira de vacinação com badges de status por vacina (Aplicada / Pendente / Atrasada) |
| **2**   | Identificar vacina com data ultrapassada e não aplicada | Detecção automática de atraso com destaque visual em vermelho e badge "Atrasada"       |
| **3**   | Visualizar campanhas de vacinação ativas                | Página de campanhas com filtro por status + destaque na home                           |
| **4**   | Acompanhar múltiplos filhos com históricos distintos    | Cada criança possui perfil independente com histórico e pendências individuais         |

---

## 🚀 Funcionalidades

- **Home** com hero slideshow e exibição de campanhas ativas em destaque
- **Listagem de crianças** com busca por nome ou responsável e barra de progresso de imunização
- **Perfil detalhado** de cada criança com carteira de vacinação completa
- **Pendências de vacinação** separadas por "Atrasadas" e "Próximas pendências"
- **Cadastro e edição** de crianças com gerenciamento de vacinas inline
- **Listagem de campanhas** com filtro por status (Todas / Ativas / Encerradas)
- **Detalhes da campanha** com informações completas e público-alvo
- **Menu lateral responsivo** para navegação em dispositivos móveis

---

## 🏗️ Arquitetura e Decisões Técnicas

### Stack

- **Angular 20** (Standalone Components, Signals, OnPush Change Detection)
- **Ionic Framework 8** (componentes UI mobile-first)
- **Firebase Firestore** (banco de dados em tempo real)
- **Firebase Hosting** (publicação com CI/CD via GitHub Actions)
- **TailwindCSS** (utilitários de layout)

### Organização do Projeto

```
src/app/
├── core/
│   └── services/          # Serviços de acesso ao Firestore
│       ├── campaign.service.ts
│       ├── child.service.ts
│       ├── vaccine.service.ts
│       └── vaccine-application.service.ts
├── pages/
│   ├── home/              # Página inicial com hero e campanhas em destaque
│   ├── children/          # Listagem, detalhes, formulário e pendências
│   └── campaigns/         # Listagem e detalhes de campanhas
└── shared/
    ├── components/        # Componentes reutilizáveis
    ├── model/             # Interfaces e tipos de domínio
    └── utils/             # Funções puras de lógica de negócio
```

### Decisões de Design

- **Lazy loading** em todas as rotas para melhor performance
- **OnPush Change Detection** em todos os componentes para otimização de renderização
- **Lógica de status vacinal isolada** em `vaccination-status.ts` — funções puras e testáveis
- **Componentes pequenos e reutilizáveis**: `StatusBadgeComponent`, `PageHeaderComponent`, `GridComponent`, `EmptyStateComponent`, `LoadingStateComponent`, `SummaryCardComponent`
- **Conversores de Firestore** centralizados para tratamento de `Timestamp → Date`

### Lógica de Status Vacinal

```
Vacina aplicada          → "Aplicada"  (verde)
Vacina pendente no prazo → "Pendente"  (laranja)
Vacina com data passada  → "Atrasada"  (vermelho)
```

A criança recebe um status geral derivado do pior cenário entre suas vacinas.

---

## 🎨 Design

A paleta de cores obrigatória foi aplicada como tokens de design em todo o projeto:

| Cor        | Hex       | Uso                                         |
| ---------- | --------- | ------------------------------------------- |
| Verde lima | `#ABC270` | Ações primárias, progresso, status positivo |
| Amarelo    | `#FEC868` | Destaques secundários                       |
| Laranja    | `#FDA769` | Ícones decorativos, status pendente         |
| Marrom     | `#473C33` | Textos principais, fundo do header/footer   |

---

## 📱 Responsividade

A aplicação é totalmente responsiva, adaptada para:

- **Mobile**: menu lateral (ion-menu), layout em coluna única, hero redimensionado
- **Tablet**: grid de 2 colunas, layout ajustado
- **Desktop**: grid de 3+ colunas, header com navegação horizontal, conteúdo centralizado com `max-width: 1280px`

---

## 🔧 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Angular CLI 20+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/kid-health.git
cd kid-health

# Instale as dependências
npm install
```

### Configuração do Firebase

Crie o arquivo `src/environments/environment.development.ts`:

```ts
export const environment = {
  firebase: {
    apiKey: 'SUA_API_KEY',
    authDomain: 'SEU_PROJETO.firebaseapp.com',
    projectId: 'SEU_PROJETO',
    storageBucket: 'SEU_PROJETO.appspot.com',
    messagingSenderId: 'SEU_ID',
    appId: 'SEU_APP_ID',
  },
};
```

### Executando

```bash
npm start
# Acesse http://localhost:4200
```

### Build de Produção

```bash
npm run build
```

---

## ☁️ Deploy

A aplicação é publicada automaticamente no **Firebase Hosting** via GitHub Actions:

- Push na branch `master` → deploy para produção
- Pull Request → deploy em canal de preview

🔗 **Acesse a aplicação:** [https://desafio-cyrrus.web.app](https://desafio-cyrrus.web.app)

---

## 📦 Modelos de Dados

### `Child`

```ts
{
  id: string;
  name: string;
  birthDate: Date;
  responsible?: string;
  totalVaccines: number;
  appliedVaccines: number;
  pendingVaccines: number;
  vaccines?: ChildVaccineItem[];
}
```

### `ChildVaccineItem`

```ts
{
  vaccineId: string;
  vaccineName: string;
  applied: boolean;
  scheduledDate: Date;
  applicationDate?: Date;
}
```

### `Campaign`

```ts
{
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
```

---

## 👨‍💻 Desenvolvido por

**Wallace Maia** — [maiawall.com](https://www.maiawall.com)

Desenvolvido como resolução do desafio técnico para o processo seletivo de estágio da **Cyrrus**.
