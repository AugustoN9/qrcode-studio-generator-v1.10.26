# 📱 QR Studio - Gerador Pro de QR Code

O **QR Studio** é uma aplicação web moderna, responsiva e minimalista desenvolvida para a geração e estilização de QR Codes em alta definição. O sistema permite personalizar layouts para impressão, redes sociais, apresentações e cartões digitais, permitindo adicionar títulos, logomarcas, gradientes e exportar em múltiplos formatos (**PNG**, **WEBP** e **SVG Vetorial**).

---

## 🚀 Funcionalidades

- **Layouts e Resoluções Personalizadas**:
  - **Vertical (Portrait / Stories)**: FHD (1080×1920), HD (720×1280), 50% HD (360×640) e Baixa Res. (240×426).
  - **Horizontal (Landscape / Banners)**: FHD (1920×1080), HD (1280×720), 50% HD (640×360) e Baixa Res. (426×240).
  - **Quadrado (Posts / Redes Sociais)**: FHD (1080×1080), HD (720×720), 50% HD (360×360) e Baixa Res. (240×240).
- **Personalização Visual Avançada**:
  - Título opcional exibido no topo do card.
  - Inserção de logomarca (com ajuste automático de posição conforme a orientação).
  - Escolha entre cor de fundo sólida ou gradiente moderno.
  - Arredondamento suave dos módulos (quadradinhos) do QR Code.
- **Exportação Flexível**:
  - **WEBP / PNG**: Com seletor de compressão de qualidade (10% a 100%).
  - **SVG**: Exportação vetorial pura e escalável para impressão gráfica sem perda de resolução.
- **Usabilidade Otimizada**:
  - Botão de ação para gerar o QR Code.
  - Botão **Limpar** para redefinir o formulário instantaneamente.
  - Limpeza automática do campo de URL após o download.
  - Pré-visualização em tempo real via HTML5 Canvas.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & Canvas 2D API**: Para renderização de gráficos, sombras e composição de imagens.
- **CSS3 & Bootstrap 5**: Design responsivo, moderno e limpo.
- **FontAwesome 6**: Iconografia da interface.
- **JavaScript Vanilla (ES6+)**: Manipulação assíncrona da DOM e cálculos de geometria do Canvas.
- **[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)**: Biblioteca JS leve para geração síncrona da matriz matemática do QR Code.

---

## 📁 Estrutura do Projeto

```text
qr-studio/
├── index.html        # Estrutura principal da página (Single Page App)
├── css/
│   └── style.css     # Estilos globais e customizações do Canvas/Preview
├── js/
│   └── script.js    # Regras de negócio, renderização no Canvas e exportação
└── README.md         # Documentação do repositório