import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook customizado para buscar dados de uma tabela do Supabase
 * @param {string} tableName - Nome da tabela
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado e dados da query
 */
export const useSupabaseQuery = (tableName, options = {}) => {
  const {
    select = '*',
    filters = [],
    orderBy = null,
    limit = null,
    enabled = true
  } = options;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from(tableName).select(select);

        // Aplicar filtros
        filters.forEach(filter => {
          const { column, operator, value } = filter;
          query = query[operator](column, value);
        });

        // Aplicar ordenação
        if (orderBy) {
          query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        // Aplicar limite
        if (limit) {
          query = query.limit(limit);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        setData(result || []);
      } catch (err) {
        setError(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tableName, select, enabled, JSON.stringify(filters), JSON.stringify(orderBy), limit]);

  return { data, isLoading, error };
};

/**
 * Hook para buscar projetos publicados
 */
export const useProjects = () => {
  return useSupabaseQuery('projetos', {
    filters: [{ column: 'publicado', operator: 'eq', value: true }],
    orderBy: { column: 'ordem', ascending: true },
    limit: 6
  });
};

/**
 * Hook para buscar posts do blog
 */
export const useBlogPosts = (limit = 3) => {
  return useSupabaseQuery('posts', {
    filters: [{ column: 'publicado', operator: 'eq', value: true }],
    orderBy: { column: 'data_publicacao', ascending: false },
    limit
  });
};

/**
 * Hook para buscar depoimentos
 */
export const useDepoimentos = () => {
  return useSupabaseQuery('depoimentos', {
    filters: [{ column: 'ativo', operator: 'eq', value: true }],
    orderBy: { column: 'ordem', ascending: true }
  });
};
// Arquivo removido: useSupabaseData.js não é mais utilizado.
