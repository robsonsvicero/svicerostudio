/**
 * Serviço de tradução usando múltiplas APIs
 * 
 * Ordem de tentativa:
 * 1. MyMemory (gratuito, sem rate limit agressivo)
 * 2. LibreTranslate (backup)
 * 
 * Para uso em produção, considere:
 * 1. Hospedar própria instância do LibreTranslate
 * 2. Usar API key para evitar rate limits
 */

// APIs disponíveis
const APIS = {
  mymemory: 'https://api.mymemory.translated.net/get',
  libretranslate: 'https://libretranslate.com/translate',
};

/**
 * Traduz usando MyMemory API (mais confiável para uso público)
 */
const translateWithMyMemory = async (text, sourceLang, targetLang) => {
  const url = `${APIS.mymemory}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('MyMemory API error');
  }
  
  const data = await response.json();
  
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }
  
  return data.responseData.translatedText;
};

/**
 * Traduz usando LibreTranslate API
 */
const translateWithLibreTranslate = async (text, sourceLang, targetLang) => {
  const response = await fetch(APIS.libretranslate, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'LibreTranslate API error');
  }

  const data = await response.json();
  return data.translatedText;
};

/**
 * Traduz texto de português para inglês
 * @param {string} text - Texto em português para traduzir
 * @returns {Promise<string>} - Texto traduzido em inglês
 */
export const translateToEnglish = async (text) => {
  if (!text || text.trim() === '') {
    return '';
  }

  // Tenta MyMemory primeiro (mais confiável)
  try {
    return await translateWithMyMemory(text, 'pt', 'en');
  } catch (error) {
    console.warn('MyMemory falhou, tentando LibreTranslate...', error);
    
    // Fallback para LibreTranslate
    try {
      return await translateWithLibreTranslate(text, 'pt', 'en');
    } catch (libError) {
      console.error('Todas as APIs de tradução falharam:', libError);
      throw new Error('Não foi possível traduzir o texto. Tente novamente em alguns minutos ou escreva manualmente a tradução.');
    }
  }
};

/**
 * Traduz texto de inglês para português
 * @param {string} text - Texto em inglês para traduzir
 * @returns {Promise<string>} - Texto traduzido em português
 */
export const translateToPortuguese = async (text) => {
  if (!text || text.trim() === '') {
    return '';
  }

  // Tenta MyMemory primeiro (mais confiável)
  try {
    return await translateWithMyMemory(text, 'en', 'pt');
  } catch (error) {
    console.warn('MyMemory falhou, tentando LibreTranslate...', error);
    
    // Fallback para LibreTranslate
    try {
      return await translateWithLibreTranslate(text, 'en', 'pt');
    } catch (libError) {
      console.error('Todas as APIs de tradução falharam:', libError);
      throw new Error('Não foi possível traduzir o texto. Tente novamente em alguns minutos ou escreva manualmente a tradução.');
    }
  }
};

/**
 * Detecta o idioma do texto
 * @param {string} text - Texto para detectar idioma
 * @returns {Promise<string>} - Código do idioma (pt, en, etc)
 */
export const detectLanguage = async (text) => {
  if (!text || text.trim() === '') {
    return 'pt';
  }

  try {
    const response = await fetch('https://libretranslate.com/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao detectar idioma');
    }

    const data = await response.json();
    return data[0]?.language || 'pt';
  } catch (error) {
    console.error('Erro na detecção de idioma:', error);
    return 'pt'; // Retorna português como padrão
  }
};
