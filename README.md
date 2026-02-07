# Avisa Energisa - Sistema de Proteção Elétrica Integrada

> **PROTÓTIPO DE FUNCIONALIDADES** | Este projeto é uma prototipação visual desenvolvida para o Ideathon Energisa 2026. Serve como referência de conceito e demonstração de interface, não representando um produto final ou implementação completa.

---

## 🎯 Visão Geral

**Avisa Energisa** é um ecossistema de Safety Tech que integra proteção ativa e participação cidadã para reduzir acidentes com a rede elétrica. O sistema opera em três camadas complementares que trabalham em conjunto para criar uma rede de segurança abrangente.

### Os Três Componentes

| Componente | Função | Público |
|------------|--------|---------|
| **Proteger (IoT)** | Dispositivo vestível que detecta proximidade da rede elétrica via campo eletromagnético | Trabalhadores e operadores de máquinas |
| **Reportes (App)** | Canal direto para cidadãos reportarem problemas na infraestrutura com foto e localização | População em geral |
| **Integração (Plataforma)** | Central que une dados para identificar zonas críticas e direcionar ações | Gestores da concessionária |

---

## ❓ Por Que Este Problema Existe

### O Paradoxo da Eletricidade Invisível

A eletricidade é útil mas letal, e seu perigo é **invisível**:

- **⚡ Arco Elétrico**: Pode saltar até 3 metros antes do contato físico
- **👁️ Imprevisibilidade**: Trabalhadores não veem, ouvem ou sentem o perigo
- **⏱️ Velocidade**: Ocorre em milissegundos, sem tempo de reação consciente
- **😴 Fadiga Humana**: EPIs e placas dependem de atenção constante que falha

> *"A eletricidade não dá segunda chance. O arco elétrico mata antes do toque."*

### Limitações das Abordagens Tradicionais

| Problema | Abordagem Tradicional | Por Que Falha |
|----------|----------------------|---------------|
| Risco invisível | EPIs e placas | Depende de percepção humana |
| Atenção falha | Treinamentos | Não cobre distrações e fadiga |
| Resposta lenta | Call centers | Tempo entre reporte e ação é longo |
| Dados fragmentados | Sistemas isolados | Não identificam padrões geográficos |

---

## 🔧 Como Funciona a Solução

### 1. Proteger (Hardware IoT) - Detecção Proativa

#### O Princípio Físico

A rede elétrica brasileira opera em **60Hz**, gerando um campo eletromagnético mensurável ao seu redor:

```
Intensidade do Campo
        ▲
        │        ┌──────────────┐
        │       ╱│              │╲
        │      ╱ │              │ ╲
        │     ╱  │              │  ╲
        │    ╱   │              │   ╲
        │   ╱    │              │    ╲
        │  ╱     │   PERIGO     │     ╲
        │ ╱      │              │      ╲
        │╱       └──────────────┘       ╲
        └─────────────────────────────────► Distância
                    Rede Elétrica
```

**Funcionamento:**
1. **Sensores** detectam variações no campo eletromagnético (60Hz)
2. **Microcontrolador** compara intensidade com limiares de segurança
3. **Atuadores** disparam alertas sonoros e táteis (vibração)
4. **Tempo de resposta**: < 100ms (muito antes da percepção consciente)

#### Versões do Dispositivo

- **Colete Inteligente**: Para trabalhadores em altura ou terrestres
- **Módulo para Máquinas**: Sensores nas extremidades de guindastes, escavadeiras, etc.

---

### 2. Reportes (Aplicativo) - Participação Cidadã

#### Fluxo do Cidadão

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. ACESSO  │───▶│  2. CAPTURA  │───▶│  3. DADOS    │
│   App/Web   │    │    Foto      │    │  Endereço    │
└─────────────┘    └──────────────┘    └──────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  6. ENVIO   │◀───│  5. REVISÃO  │◀───│  4. ANÁLISE  │
│  Protocolo  │    │   Confirma   │    │   IA (mock)  │
└─────────────┘    └──────────────┘    └──────────────┘
```

#### Funcionalidades Implementadas

- 📸 **Captura de Imagem**: Câmera nativa ou galeria
- 🎨 **Degradê Visual**: Interface com identidade visual energética
- 🌓 **Tema Dark/Light**: Alternância suave entre modos
- 📝 **Endereço Manual**: Input obrigatório para localização precisa
- 🏷️ **Categorização**: Tipos pré-definidos (cabo rompido, poste danificado, etc.)
- 📱 **Responsivo**: Interface adaptada para mobile

---

### 3. Integração (Plataforma) - Inteligência de Dados

#### Zonas de Calor

```
     Mapa de Incidentes
     
     🔴 Zona Crítica
        (10+ reportes)
        
   🟡 Zona de Atenção      🟢 Área Segura
      (5-9 reportes)         (0-4 reportes)
      
   📍 Proteger Alertas: ██▓▓░░
   (Intensidade das detecções)
```

**Como a integração cria valor:**
- Correlação entre reportes cidadãos e alertas Proteger
- Identificação de áreas com problemas sistêmicos
- Priorização baseada em dados, não intuição
- Histórico para análise de tendências

---

## 💡 Por Que Funciona

### Proteção em Camadas

```
┌─────────────────────────────────────────┐
│         SISTEMA AVISA ENERGISA          │
├─────────────────────────────────────────┤
│  🔴 CAMADA 1: Proteção Individual       │
│     Colete/IoT alerta antes do contato  │
├─────────────────────────────────────────┤
│  🟡 CAMADA 2: Identificação Coletiva    │
│     Cidadãos reportam problemas         │
├─────────────────────────────────────────┤
│  🟢 CAMADA 3: Análise Inteligente       │
│     Dados convergem para ação           │
└─────────────────────────────────────────┘
```

### Ciclo Virtuoso

```
Mais Reportes ──────▶ Melhor Calibração
      ▲                      │
      │                      ▼
Intervenção ◀─── Detecções Proteger
```

### Fundamentação Técnica

- **Física Comprovada**: Campo eletromagnético 60Hz existe independentemente de condições
- **Alerta Automático**: Elimina dependência de atenção humana
- **Escalabilidade**: Hardware simples, software adaptável
- **Custo-Benefício**: Prevenção é mais barata que indenização + vida

---

## 🛠️ Tecnologias Utilizadas

### Stack do Protótipo

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Framework | React | 19.2.0 |
| Build | Vite | 7.x |
| Estilo | TailwindCSS | 4.1.18 |
| Roteamento | React Router DOM | 7.13.0 |
| Animações | Framer Motion | 12.x |
| Ícones | Lucide React | 0.563.0 |

### APIs do Navegador

- **MediaDevices**: Acesso à câmera com 3 níveis de fallback
- **localStorage**: Persistência de dados local
- **Geolocation API**: Removida em favor de input manual

---

## ⚠️ Importante: Sobre Este Protótipo

### O Que É

✅ **Demonstração de conceito** - Interface e fluxos de usuário  
✅ **Protótipo visual** - Referência para desenvolvimento futuro  
✅ **Validação de ideia** - Teste de usabilidade e fluxo  
✅ **Apresentação** - Material para pitch e avaliação  

### O Que Não É

❌ **Produto final** - Não está pronto para produção  
❌ **Hardware real** - IoT é conceitual/não implementado  
❌ **IA funcional** - Análise de imagem é simulada (mock)  
❌ **Backend real** - Dados são armazenados localmente  
❌ **Segurança robusta** - Autenticação é mock (qualquer login funciona)  

### Limitações do Protótipo

| Aspecto | Implementação | Realidade Futura |
|---------|---------------|------------------|
| Autenticação | Mock (qualquer email/senha) | OAuth/JWT real |
| Armazenamento | localStorage apenas | Backend + banco de dados |
| IA | Timeout simulado (2s) + random | ML treinado com imagens |
| IoT | Interface apenas | Hardware com sensores reais |
| Geolocalização | Input manual | GPS automático + fallback |
| Notificações | Toast local | Push notifications |

---

## 🚀 Como Executar

### Requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [repositório]

# Instale dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Ou gere build para produção
npm run build
```

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run lint     # Verificação de código
npm run preview  # Preview do build
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Header.jsx   # Cabeçalho com tema
│   └── Toast.jsx    # Notificações
├── context/         # Estados globais
│   ├── ToastContext.js
│   ├── ReportesContext.jsx
│   ├── TecnicoContext.jsx
│   └── ThemeContext.jsx    # Dark/Light mode
├── hooks/           # Hooks customizados
│   ├── useReportes.js
│   └── useTecnico.js
├── pages/           # Páginas principais
│   ├── Home.jsx            # Home com lista
│   ├── Reportar.jsx        # Fluxo de reporte
│   ├── LoginTecnico.jsx    # Área técnica
│   ├── Parear.jsx          # Pareamento IoT
│   └── Professional.jsx    # Container técnico
├── utils/           # Utilitários
│   └── helpers.js
├── App.jsx          # Rotas e providers
└── index.css        # Tema shadcn + variáveis
```

---

## 🎨 Identidade Visual

### Cores Principais

- **Primária**: `#0096D6` (Azul ciano - energia/confiança)
- **Secundária**: `#2D3E50` (Cinza escuro - técnico/profissional)
- **Destaque**: `#F37021` (Laranja - alerta/atenção)
- **Degradê**: `#019ac5` → `#caee74` (Azul → Verde/energia)

### Tipografia

- **Fonte**: Inter (sans-serif)
- **Tracking**: -0.01em (moderno/compacto)

---

## 📊 Resultados Esperados (Em Implementação Real)

### Para Trabalhadores
- Redução mensurável de quase-acidentes
- Acompanhamento de exposição a riscos
- Cultura de segurança reforçada

### Para Cidadãos
- Canal simples de contribuição
- Acompanhamento de status
- Conscientização sobre riscos

### Para a Concessionária
- Identificação proativa de problemas
- Otimização de rotas via zonas de calor
- Dados para mensurar eficácia
- Redução comprovável de acidentes

---

## 🏆 Contexto do Ideathon

**Evento:** Ideathon Energisa - 7 de fevereiro de 2026  
**Organização:** Energisa S.A. + Comunidade Hackathon Brasil  
**Valor Central:** Vida em primeiro lugar  
**Tema:** Como desenvolver soluções eficazes para minimizar riscos e garantir maior segurança da população em proximidade com a rede elétrica?

---

## 👥 Equipe

**Projeto:** Avisa Energisa  
**Status:** Protótipo para Ideathon 2026

---

## 📄 Licença

Este projeto foi desenvolvido para fins de demonstração no Ideathon Energisa 2026.

---

<div align="center">

**⚡ Energia segura é energia consciente ⚡**

</div>
