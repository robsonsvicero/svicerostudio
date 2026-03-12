import sharp from 'sharp';

/**
 * Comprime e converte uma imagem buffer para WebP, mantendo qualidade visual.
 * @param {Buffer} buffer - Buffer da imagem original
 * @param {Object} [options] - Opções de compressão
 * @param {number} [options.quality=80] - Qualidade WebP (0-100)
 * @param {number} [options.maxWidth=1200] - Largura máxima
 * @returns {Promise<Buffer>} - Buffer comprimido
 */
export async function compressImage(buffer, options = {}) {
  const quality = options.quality || 80;
  const maxWidth = options.maxWidth || 1200;
  return sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}
