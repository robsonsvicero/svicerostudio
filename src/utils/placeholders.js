/**
 * Gera um placeholder SVG em base64 que funciona offline
 * @param {string} letter - Primeira letra do texto
 * @param {string} bgColor - Cor de fundo (hex sem #)
 * @param {number} size - Tamanho em pixels
 * @returns {string} Data URL do SVG
 */
export function getPlaceholderImage(letter = '?', bgColor = '1a1a1a', size = 150) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#${bgColor}"/>
    <text x="50%" y="50%" font-size="${size * 0.5}" font-weight="bold" fill="#E9BF84" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif">
      ${(letter || 'P').toUpperCase()}
    </text>
  </svg>`;
  
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}

/**
 * Gera um placeholder para avatar (circular)
 */
export function getAvatarPlaceholder(letter = '?', bgColor = '1a1a1a', size = 150) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#${bgColor}"/>
    <text x="50%" y="50%" font-size="${size * 0.5}" font-weight="bold" fill="#E9BF84" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif">
      ${(letter || 'A').toUpperCase()}
    </text>
  </svg>`;
  
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}
