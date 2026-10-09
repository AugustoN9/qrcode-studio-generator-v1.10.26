// Estado da Aplicação
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
let currentLogoImg = null;

// Elementos do DOM
const titleInput = document.getElementById('titleInput');
const urlInput = document.getElementById('urlInput');
const formatSelect = document.getElementById('formatSelect');
const enableLogoCheck = document.getElementById('enableLogoCheck');
const logoInput = document.getElementById('logoInput');
const bgTypeSelect = document.getElementById('bgTypeSelect');
const bgColorInput = document.getElementById('bgColorInput');
const bgColorInput2 = document.getElementById('bgColorInput2');
const gradientGroup = document.getElementById('gradientGroup');
const qrColorInput = document.getElementById('qrColorInput');
const radiusInput = document.getElementById('radiusInput');
const generateBtn = document.getElementById('generateBtn');
const exportFormatSelect = document.getElementById('exportFormatSelect');
const qualityInput = document.getElementById('qualityInput');
const qualityVal = document.getElementById('qualityVal');
const qualityContainer = document.getElementById('qualityContainer');
const downloadBtn = document.getElementById('downloadBtn');

// Mapeamento das Resoluções
const RESOLUTION_MAP = {
  'mobile_fhd': { width: 1080, height: 1920, type: 'vertical' },
  'mobile_hd': { width: 720, height: 1280, type: 'vertical' },
  'mobile_50': { width: 360, height: 640, type: 'vertical' },
  'mobile_low': { width: 240, height: 426, type: 'vertical' },
  
  'landscape_fhd': { width: 1920, height: 1080, type: 'horizontal' },
  'landscape_hd': { width: 1280, height: 720, type: 'horizontal' },
  'landscape_50': { width: 640, height: 360, type: 'horizontal' },
  'landscape_low': { width: 426, height: 240, type: 'horizontal' },

  'square_fhd': { width: 1080, height: 1080, type: 'square' },
  'square_hd': { width: 720, height: 720, type: 'square' },
  'square_50': { width: 360, height: 360, type: 'square' },
  'square_low': { width: 240, height: 240, type: 'square' }
};

// Eventos
generateBtn.addEventListener('click', renderCard);

bgTypeSelect.addEventListener('change', () => {
  if (bgTypeSelect.value === 'gradient') {
    gradientGroup.classList.remove('d-none');
  } else {
    gradientGroup.classList.add('d-none');
  }
});

qualityInput.addEventListener('input', (e) => {
  qualityVal.textContent = `${e.target.value}%`;
});

exportFormatSelect.addEventListener('change', () => {
  if (exportFormatSelect.value === 'image/svg+xml') {
    qualityContainer.style.opacity = '0.4';
    qualityInput.disabled = true;
  } else {
    qualityContainer.style.opacity = '1';
    qualityInput.disabled = false;
  }
});

logoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentLogoImg = img;
        renderCard();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    currentLogoImg = null;
    renderCard();
  }
});

function getQRMatrix(text) {
  try {
    const qr = qrcode(0, 'H');
    qr.addData(text);
    qr.make();
    
    const count = qr.getModuleCount();
    const matrix = [];
    
    for (let row = 0; row < count; row++) {
      const rowArr = [];
      for (let col = 0; col < count; col++) {
        rowArr.push(qr.isDark(row, col));
      }
      matrix.push(rowArr);
    }
    return { count, matrix };
  } catch (err) {
    console.error("Erro ao gerar matriz do QR Code:", err);
    return null;
  }
}

// Renderização no Canvas
function renderCard() {
  const text = urlInput.value.trim() || 'https://google.com';
  const titleText = titleInput.value.trim();
  const selectedFormatKey = formatSelect.value;
  const config = RESOLUTION_MAP[selectedFormatKey] || RESOLUTION_MAP['mobile_fhd'];

  const showLogo = enableLogoCheck.checked;
  const bgColor1 = bgColorInput.value;
  const bgColor2 = bgColorInput2.value;
  const qrColor = qrColorInput.value;
  const bgType = bgTypeSelect.value;
  const borderRadiusPercent = parseInt(radiusInput.value) / 100;

  canvas.width = config.width;
  canvas.height = config.height;

  // 1. Fundo
  if (bgType === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = bgColor1;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Título do Card (se preenchido)
  if (titleText) {
    const titleFontSize = Math.max(18, Math.round(canvas.width * 0.045));
    ctx.font = `700 ${titleFontSize}px 'Inter', sans-serif`;
    ctx.fillStyle = qrColor;
    ctx.textAlign = 'center';
    
    const titleY = config.type === 'vertical' ? canvas.height * 0.09 : canvas.height * 0.12;
    ctx.fillText(titleText, canvas.width / 2, titleY);
  }

  // 3. Matriz QR
  const qrData = getQRMatrix(text);
  if (!qrData) return;

  const { count: moduleCount, matrix } = qrData;

  let qrSize, qrX, qrY;
  if (config.type === 'vertical') {
    qrSize = config.width * 0.60;
    qrX = (canvas.width - qrSize) / 2;
    qrY = (canvas.height - qrSize) / 2 + (titleText ? config.height * 0.03 : 0);
  } else if (config.type === 'horizontal') {
    qrSize = config.height * 0.58;
    qrX = (showLogo && currentLogoImg) ? canvas.width * 0.52 : (canvas.width - qrSize) / 2;
    qrY = (canvas.height - qrSize) / 2 + (titleText ? config.height * 0.04 : 0);
  } else {
    qrSize = config.width * 0.60;
    qrX = (canvas.width - qrSize) / 2;
    qrY = (canvas.height - qrSize) / 2 + (titleText ? config.height * 0.03 : -config.height * 0.02);
  }

  const cellSize = qrSize / moduleCount;
  const radius = (cellSize / 2) * borderRadiusPercent;

  ctx.fillStyle = qrColor;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (matrix[row][col]) {
        if (config.type === 'square' && showLogo && currentLogoImg) {
          const centerStart = Math.floor(moduleCount * 0.38);
          const centerEnd = Math.floor(moduleCount * 0.62);
          if (row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd) {
            continue;
          }
        }

        const x = qrX + col * cellSize;
        const y = qrY + row * cellSize;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, cellSize + 0.4, cellSize + 0.4, radius);
        } else {
          ctx.rect(x, y, cellSize, cellSize);
        }
        ctx.fill();
      }
    }
  }

  // 4. Logomarca
  if (showLogo && currentLogoImg) {
    if (config.type === 'vertical') {
      const logoSize = config.width * 0.18;
      const logoX = (canvas.width - logoSize) / 2;
      const logoY = qrY - logoSize - (config.height * 0.03);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(currentLogoImg, logoX, logoY, logoSize, logoSize);
      ctx.restore();

    } else if (config.type === 'horizontal') {
      const logoSize = config.height * 0.32;
      const logoX = canvas.width * 0.18;
      const logoY = (canvas.height - logoSize) / 2 + (titleText ? config.height * 0.04 : 0);

      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(currentLogoImg, logoX, logoY, logoSize, logoSize);
      ctx.restore();

    } else {
      const centerLogoSize = qrSize * 0.22;
      const logoX = (canvas.width - centerLogoSize) / 2;
      const logoY = qrY + (qrSize - centerLogoSize) / 2;

      ctx.fillStyle = bgColor1;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, logoY + centerLogoSize/2, centerLogoSize / 2 + (centerLogoSize * 0.1), 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, logoY + centerLogoSize/2, centerLogoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(currentLogoImg, logoX, logoY, centerLogoSize, centerLogoSize);
      ctx.restore();
    }
  }

  // 5. Desenhar Assinatura/Rodapé
  const footerText = "Desenvolvido por @AugustoN9 - 2026 - 8.10";
  const fontSize = Math.max(14, Math.round(canvas.width * 0.025));
  
  ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
  ctx.fillStyle = qrColor;
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.85;
  
  const footerY = canvas.height - (canvas.height * 0.04);
  ctx.fillText(footerText, canvas.width / 2, footerY);
  ctx.globalAlpha = 1.0;
}

// Handler de Download + Limpeza do Input de URL
downloadBtn.addEventListener('click', () => {
  renderCard();

  const selectedMime = exportFormatSelect.value;
  const quality = parseFloat(qualityInput.value) / 100;
  const formatName = formatSelect.value;
  const timestamp = Date.now();

  if (selectedMime === 'image/svg+xml') {
    exportAsSVG(`qrcode-${formatName}-${timestamp}.svg`);
  } else {
    const extension = selectedMime === 'image/png' ? 'png' : 'webp';
    const dataURL = canvas.toDataURL(selectedMime, quality);
    
    const link = document.createElement('a');
    link.download = `qrcode-${formatName}-${timestamp}.${extension}`;
    link.href = dataURL;
    link.click();
  }

  // Limpa o campo de URL após o disparo do download
  urlInput.value = '';
});

// Exportar SVG com Título e Rodapé
function exportAsSVG(filename) {
  const text = urlInput.value.trim() || 'https://google.com';
  const titleText = titleInput.value.trim();
  const selectedFormatKey = formatSelect.value;
  const config = RESOLUTION_MAP[selectedFormatKey] || RESOLUTION_MAP['mobile_fhd'];

  const showLogo = enableLogoCheck.checked;
  const bgColor1 = bgColorInput.value;
  const bgColor2 = bgColorInput2.value;
  const qrColor = qrColorInput.value;
  const bgType = bgTypeSelect.value;
  const borderRadiusPercent = parseInt(radiusInput.value) / 100;

  const width = config.width;
  const height = config.height;

  const qrData = getQRMatrix(text);
  if (!qrData) return;

  const { count: moduleCount, matrix } = qrData;

  let qrSize, qrX, qrY;
  if (config.type === 'vertical') {
    qrSize = width * 0.60;
    qrX = (width - qrSize) / 2;
    qrY = (height - qrSize) / 2 + (titleText ? height * 0.03 : 0);
  } else if (config.type === 'horizontal') {
    qrSize = height * 0.58;
    qrX = (showLogo && currentLogoImg) ? width * 0.52 : (width - qrSize) / 2;
    qrY = (height - qrSize) / 2 + (titleText ? height * 0.04 : 0);
  } else {
    qrSize = width * 0.60;
    qrX = (width - qrSize) / 2;
    qrY = (height - qrSize) / 2 + (titleText ? height * 0.03 : -height * 0.02);
  }

  const cellSize = qrSize / moduleCount;
  const rx = (cellSize / 2) * borderRadiusPercent;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
  
  // Fundo
  if (bgType === 'gradient') {
    svgContent += `  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgColor1}" />
      <stop offset="100%" stop-color="${bgColor2}" />
    </linearGradient>
  </defs>\n`;
    svgContent += `  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />\n`;
  } else {
    svgContent += `  <rect width="${width}" height="${height}" fill="${bgColor1}" />\n`;
  }

  // Título
  if (titleText) {
    const titleFontSize = Math.max(18, Math.round(width * 0.045));
    const titleY = config.type === 'vertical' ? height * 0.09 : height * 0.12;
    svgContent += `  <text x="${width / 2}" y="${titleY}" font-family="'Inter', sans-serif" font-size="${titleFontSize}" font-weight="700" fill="${qrColor}" text-anchor="middle">${titleText}</text>\n`;
  }

  // Módulos
  svgContent += `  <g fill="${qrColor}">\n`;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (matrix[row][col]) {
        if (config.type === 'square' && showLogo && currentLogoImg) {
          const centerStart = Math.floor(moduleCount * 0.38);
          const centerEnd = Math.floor(moduleCount * 0.62);
          if (row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd) {
            continue;
          }
        }

        const x = qrX + col * cellSize;
        const y = qrY + row * cellSize;
        svgContent += `    <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cellSize + 0.3).toFixed(2)}" height="${(cellSize + 0.3).toFixed(2)}" rx="${rx.toFixed(2)}" ry="${rx.toFixed(2)}" />\n`;
      }
    }
  }
  svgContent += `  </g>\n`;

  // Logomarca
  if (showLogo && currentLogoImg) {
    const logoBase64 = currentLogoImg.src;

    if (config.type === 'vertical') {
      const logoSize = width * 0.18;
      const logoX = (width - logoSize) / 2;
      const logoY = qrY - logoSize - (height * 0.03);

      svgContent += `  <defs>
    <clipPath id="logoClip">
      <circle cx="${logoX + logoSize/2}" cy="${logoY + logoSize/2}" r="${logoSize/2}" />
    </clipPath>
  </defs>\n`;
      svgContent += `  <image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" clip-path="url(#logoClip)" />\n`;

    } else if (config.type === 'horizontal') {
      const logoSize = height * 0.32;
      const logoX = width * 0.18;
      const logoY = (height - logoSize) / 2 + (titleText ? height * 0.04 : 0);

      svgContent += `  <defs>
    <clipPath id="logoClipHoriz">
      <circle cx="${logoX + logoSize/2}" cy="${logoY + logoSize/2}" r="${logoSize/2}" />
    </clipPath>
  </defs>\n`;
      svgContent += `  <image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" clip-path="url(#logoClipHoriz)" />\n`;

    } else {
      const centerLogoSize = qrSize * 0.22;
      const logoX = (width - centerLogoSize) / 2;
      const logoY = qrY + (qrSize - centerLogoSize) / 2;

      svgContent += `  <circle cx="${width/2}" cy="${logoY + centerLogoSize/2}" r="${centerLogoSize/2 + (centerLogoSize * 0.1)}" fill="${bgColor1}" />\n`;
      svgContent += `  <defs>
    <clipPath id="centerLogoClip">
      <circle cx="${width/2}" cy="${logoY + centerLogoSize/2}" r="${centerLogoSize/2}" />
    </clipPath>
  </defs>\n`;
      svgContent += `  <image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${centerLogoSize}" height="${centerLogoSize}" clip-path="url(#centerLogoClip)" />\n`;
    }
  }

  // Rodapé
  const footerText = "Desenvolvido por @AugustoN9 - 2026 - 8.10";
  const fontSize = Math.max(14, Math.round(width * 0.025));
  const footerY = height - (height * 0.04);

  svgContent += `  <text x="${width / 2}" y="${footerY}" font-family="'Inter', sans-serif" font-size="${fontSize}" font-weight="600" fill="${qrColor}" opacity="0.85" text-anchor="middle">${footerText}</text>\n`;

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
}

window.onload = renderCard;