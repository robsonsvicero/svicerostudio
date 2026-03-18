// src/utils/slugGenerator.js

/**
 * Gera um slug amigável para URL a partir de uma string de texto.
 * @param {string} text - O texto de entrada (ex: nome do autor, título do artigo).
 * @returns {string} O slug gerado.
 */
export const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toString()
        .normalize('NFD') // Normaliza caracteres acentuados (ex: "á" para "a")
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase() // Converte para minúsculas
        .trim() // Remove espaços em branco no início e fim
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/[^\w-]+/g, '') // Remove todos os caracteres não-palavra (exceto hífens)
        .replace(/--+/g, '-'); // Substitui múltiplos hífens por um único
};