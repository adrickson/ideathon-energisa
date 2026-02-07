# Guia para Desenvolvimento - Avisa Energisa

## Visão Geral do Projeto

Sistema de segurança elétrica com dois componentes principais:
- **App Cidadão**: Reportar problemas na rede elétrica (fotos + endereço manual)
- **App Técnico**: Login + pareamento de dispositivos IoT

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2.0 | Framework UI |
| Vite | 7.x | Bundler |
| TailwindCSS | 4.1.18 | Estilização (CSS-first config) |
| React Router DOM | 7.13.0 | Roteamento |
| Framer Motion | 12.x | Animações |
| Lucide React | 0.563.0 | Ícones |
| clsx | 2.x | Classes condicionais |
| tailwind-merge | 3.x | Merge de classes |

## Estrutura de Arquivos

```
src/
├── components/
│   ├── Header.jsx       # Cabeçalho com menu
│   └── Toast.jsx        # Sistema de notificações (estilo shadcn)
├── context/
│   ├── ToastContext.js      # Context para toasts
│   ├── ReportesContext.jsx  # CRUD de reportes + localStorage
│   ├── TecnicoContext.jsx   # Técnico logado + dispositivo IoT
│   └── ThemeContext.jsx     # Tema light/dark mode
├── hooks/
│   ├── useReportes.js   # Hook para consumir ReportesContext
│   └── useTecnico.js     # Hook para consumir TecnicoContext
├── pages/
│   ├── Home.jsx         # Home + lista de reportes
│   ├── Reportar.jsx      # Fluxo completo: câmera → GPS → tipo → confirmar
│   ├── LoginTecnico.jsx  # Login mock do técnico
│   ├── Parear.jsx        # Pareamento de dispositivo IoT
│   └── Professional.jsx  # Container do fluxo profissional
├── services/
│   └── api.js            # Funções de API (mock, prontas para backend)
├── utils/
│   └── helpers.js        # Funções utilitárias
├── App.jsx              # Providers + Routes
├── index.css             # Tema shadcn OKLCH
└── main.jsx             # Entry point
```

## Configuração de Tema (shadcn OKLCH)

O projeto usa **TailwindCSS v4 com CSS variables OKLCH**. Não há `tailwind.config.js`.

### Cores do Tema

| Variável | Cor | Uso |
|----------|------|-----|
| `--primary` | `#0096D6` (azul ciano) | Botões principais, Header |
| `--secondary` | `#2D3E50` (cinza escuro) | Área técnica |
| `--accent` | `#F37021` (laranja) | Ícones de alerta |
| `--background` | Off-white | Fundo da página |
| `--card` | White | Cards e containers |
| `--foreground` | Cinza escuro | Texto principal |
| `--destructive` | Vermelho | Erros |
| `--muted` | Cinza claro | Fundos secundários |
| `--border` | Cinza médio | Bordas |

### Classes Usadas nos Componentes

```jsx
// Fundo principal
<div className="bg-background">...</div>

// Card
<div className="bg-card border border-border">...</div>

// Botão primário
<button className="bg-primary text-primary-foreground">...</button>

// Botão secundário
<button className="bg-secondary text-secondary-foreground">...</button>

// Texto
<p className="text-foreground">...</p>
<p className="text-muted-foreground">...</p>

// Erro
<p className="text-destructive">...</p>

// Alerta
<span className="text-accent">...</span>
```

### Sistema de Tema (Dark/Light Mode)

O projeto possui sistema completo de tema claro/escuro usando shadcn/ui.

**Arquivos:**
- `src/context/ThemeContext.jsx` - Provider e hook useTheme
- `src/App.jsx` - ThemeProvider no provider stack

**Uso:**
```jsx
import { useTheme } from "../context/ThemeContext.jsx";

const { theme, toggleTheme, isDark } = useTheme();

// Toggle button
<button onClick={toggleTheme}>
  {isDark ? <Sun /> : <Moon />}
</button>
```

**Persistência:**
- Tema salvo em `localStorage` com chave `@energisa_ideathon:theme`
- Detecta preferência do sistema (`prefers-color-scheme`)
- Aplica classe `.dark` no elemento `<html>`

## Convenções de Código

### Hooks (React)

```jsx
// useCallback para funções de event handlers
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  // lógica
}, [dependencies]);

// useState para estado local
const [loading, setLoading] = useState(false);
```

### Contexts

Cada context segue o padrão:

```jsx
// Context provider exports
export function XyzProvider({ children }) { ... }
export function useXyz() { ... }

// Storage key para localStorage
const STORAGE_KEY = "@energisa_ideathon:xyz";
```

### Roteamento

```jsx
// Rotas no App.jsx
<Routes>
  <Route path="/" element={<><Header /><Home /></>} />
  <Route path="/reportar" element={<Reportar />} />
  <Route path="/professional/*" element={<Professional />} />
</Routes>
```

### Estilo JSX

- Props em múltiplas linhas para componentes longos
- `className` em vez de `class`
- Classes Tailwind organizadas por: layout → spacing → colors → typography → effects
- `framerções de entrada:-motion` para anima `initial={{ opacity: 0, y: 20 }}`

## APIs do Navegador Usadas

### Input de Endereço Manual

**IMPORTANTE:** Geolocalização automática foi substituída por **input de endereço manual** para funcionar em qualquer ambiente (localhost, HTTP, etc.).

**Implementação:**
```jsx
const [endereco, setEndereco] = useState("");

<input
  type="text"
  value={endereco}
  onChange={(e) => setEndereco(e.target.value)}
  placeholder="Rua, número, bairro, cidade..."
/>
```

**Validação:**
- Campo é **obrigatório**
- Trim automático: `endereco.trim()`
- Mensagem de erro se vazio
- Latitude/Longitude mantidos como `null` no banco

### MediaDevices API (Câmera) - Melhorada

O sistema implementa **3 tentativas de acesso** para máxima compatibilidade:

```javascript
// Tentativa 1: Sem constraints (mais compatível)
// Tentativa 2: Com facingMode: "environment" (câmera traseira)
// Tentativa 3: Com facingMode: "user" (câmera frontal)

const iniciarCamera = async () => {
  let mediaStream = null;
  
  // Tentativa 1
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch {
    // Tentar próxima...
  }
  
  // Tentativa 2 e 3...
};
```

**Tratamento de Erros Aprimorado:**
- `NotAllowedError` → Instruções para permitir nas configurações
- `NotFoundError` → Fallback para galeria
- `NotReadableError` → Câmera em uso por outro app
- `OverconstrainedError` → Configuração não suportada

**IMPORTANTE**: `navigator.mediaDevices` requer contexto seguro (HTTPS ou localhost). Sempre verificar suporte antes de usar.

### localStorage

```javascript
// Salvar
localStorage.setItem("@energisa_ideathon:chave", JSON.stringify(data));

// Carregar
const stored = localStorage.getItem("@energisa_ideathon:chave");
if (stored) setData(JSON.parse(stored));
```

## Padrões de Teste

### Lint

```bash
npm run lint  # Verifica erros de código
```

### Build

```bash
npm run build  # Gera versão de produção
```

### Dev Server

```bash
npm run dev  # Inicia servidor de desenvolvimento
```

## Fluxos do Usuário

### 1. Reportar Problema (Cidadão)

1. Acessa Home → "Reportar Ocorrência"
2. Tira foto (câmera) OU seleciona da galeria
3. Informa endereço manualmente (campo obrigatório)
4. Seleciona tipo de ocorrência
5. Revisa dados → Clica "Enviar Reporte"
6. **Vê Ticket de Confirmação** com protocolo
7. Volta para Home

### 2. Login Técnico (Mock)

1. Acessa "Modo Profissional"
2. Qualquer email/senha funciona
3. Redireciona para pareamento

### 3. Parear Dispositivo IoT

1. Seleciona tipo (Colete / Módulo)
2. Insere código (formato: `ABC123-XYZ`)
3. Simula conexão (2s delay)
4. Salva dispositivo no TecnicoContext

## Variáveis de Ambiente

```env
VITE_API_URL=/api  # URL base do backend (futuro)
```

## Códigos de Exemplo Úteis

### Verificar se é mobile

```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
```

### Formatar coordenadas

```javascript
const formatCoords = (lat, lng) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
```

### Toast notification

```javascript
const { toastSuccess, toastError } = useToast();

// Sucesso
toastSuccess({ title: "Salvo!", message: "Dados salvos com sucesso." });

// Erro
toastError({ title: "Erro", message: "Falha ao salvar." });
```

## Degradês Personalizados

Para aplicar degradês fora do tema padrão, use classes Tailwind com cores hex:

```jsx
// Degradê linear horizontal
<button className="bg-gradient-to-r from-[#019ac5] to-[#caee74]">
  Texto
</button>

// Degradê diagonal
<div className="bg-gradient-to-br from-[#019ac5] to-[#caee74]">
  Conteúdo
</div>
```

**Onde estão aplicados:**
- Botão "Reportar Ocorrência" na Home
- Card "Tirar Foto" na página de reportar

### Modal de Ticket (Confirmação de Envio)

Após enviar o reporte, um modal é exibido com todas as informações:

**Dados exibidos:**
- Foto do problema
- Tipo de ocorrência
- Endereço completo
- Observações (se houver)
- Status: "Pendente"
- Data e hora do envio
- **Protocolo único** (formato: AV-{timestamp})

**Implementação:**
```jsx
const [showTicket, setShowTicket] = useState(false);
const [ticketData, setTicketData] = useState(null);

// Gerar protocolo
const protocolo = `AV-${Date.now().toString(36).toUpperCase()}`;
const dataEnvio = new Date().toLocaleString('pt-BR');
```

**Botão único:** "Voltar para Home"

### Ícones dos Tipos de Ocorrência

Os tipos de ocorrência usam ícones do **Lucide React** (não emojis):

| Tipo | Ícone | Componente |
|------|-------|------------|
| Cabo Rompido | 🔗 Link quebrado | `Unlink` |
| Cabo Baixo | ⬇️ Seta para baixo | `ArrowBigDown` |
| Poste Danificado | 🚧 Construção | `Construction` |
| Transformador | 💻 Componente | `Cpu` |
| Falta de Energia | 💡 Lâmpada apagada | `LightbulbOff` |
| Outro | ❓ Ajuda | `HelpCircle` |

**Uso no código:**
```jsx
const TIPOS_OCORRENCIA = [
  { id: "cabo_rompido", label: "Cabo Rompido", icon: Unlink },
  { id: "cabo_baixo", label: "Cabo Baixo", icon: ArrowBigDown },
  { id: "poste_danificado", label: "Poste Danificado", icon: Construction },
  { id: "transformador_queimado", label: "Transformador", icon: Cpu },
  { id: "falta_energia", label: "Falta de Energia", icon: LightbulbOff },
  { id: "outro", label: "Outro", icon: HelpCircle },
];

// Renderização
<div className="mb-2">
  <tipo.icon size={24} className="text-foreground" />
</div>
```

## Coisas a Evitar

1. **NÃO usar cores hardcoded** - Use as variáveis do tema (`bg-primary`, `text-destructive`, etc.)
2. **NÃO criar `tailwind.config.js`** - Tailwind v4 usa CSS-first config em `index.css`
3. **NÃO esquecer de verificar `navigator.mediaDevices`** antes de usar câmera
4. **NÃO usar `class`** - use `className`
5. **NÃO fazer import de `motion.div` diretamente** - use `{ motion } from "framer-motion"`
6. **NÃO chamar setState diretamente no corpo de useEffect** - causa re-renderizações em cascata

## Para Próximas Modificações

### Adicionar nova página

1. Criar arquivo em `src/pages/NovaPagina.jsx`
2. Adicionar rota em `src/App.jsx`
3. Se precisar de context, criar em `src/context/NovoContext.jsx`
4. Se precisar de hook, criar em `src/hooks/useNovo.js`

### Modificar cores do tema

1. Editar variáveis em `src/index.css` (`:root` para light, `.dark` para dark mode)
2. As classes Tailwind (`bg-primary`, `text-foreground`, etc.) atualizam automaticamente

### Adicionar funcionalidade de câmera

1. Sempre verificar `cameraSuportado` antes de chamar `navigator.mediaDevices.getUserMedia`
2. Oferecer fallback para galeria (`<input type="file" accept="image/*">`)
3. Tratar erros com toast notifications

## Arquivo de Referência

Este guia deve ser lido junto com:
- `README.md` - Visão geral do produto
- `src/index.css` - Tema completo
- `src/pages/*.jsx` - Exemplos de implementação
