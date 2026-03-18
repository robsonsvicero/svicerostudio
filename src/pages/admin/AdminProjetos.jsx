// src/pages/admin/AdminProjetos.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import slugify from 'slugify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminProjetos = () => {
  const { token, signOut } = useAuth();
  const navigate = useNavigate();

  // CHAME O HOOK useToast AQUI DENTRO DO COMPONENTE
  const { showToastMessage, showToast, toastMessage, toastType } = useToast();

  const initialFormState = {
    titulo: '',
    slug: '',
    categoria: '',
    cliente: '',
    data_projeto: '',
    status: 'draft', // 'published', 'draft', 'archived'
    descricao: '',
    descricao_longa: '',
    descricao_longa_en: '',
    imagem_url: '',
    site_url: '',
    link: '',
    button_text: 'Ver Projeto',
    link2: '',
    button_text2: '',
    mostrar_home: true,
  };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(null); // Stores the project ID being edited
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation: 'find', filters: [], sort: { created_at: -1 } }),
      });
      if (!res.ok) {
        if (res.status === 401) signOut();
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      setError(err.message);
      showToastMessage(err.message, 'error'); // Agora funciona
    } finally {
      setLoading(false);
    }
  }, [token, signOut, showToastMessage]); // Adicione showToastMessage às dependências

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, fetchProjects]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditProject = (proj) => {
    setEditing(proj.id); // Use proj.id for consistency
    setForm({
      ...proj,
      // Garante que o slug seja preenchido se o projeto antigo não o tiver
      slug: proj.slug || slugify(proj.titulo || '', { lower: true, strict: true }),
      // Garante que a data_projeto esteja no formato correto para o input type="date"
      data_projeto: proj.data_projeto ? new Date(proj.data_projeto).toISOString().split('T')[0] : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm(initialFormState);
    setError('');
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadError('');

    if (!token) {
      signOut();
      navigate('/login');
      return;
    }

    // Validação frontend
    const validationErrors = [];
    if (!form.titulo?.trim()) validationErrors.push('Título é obrigatório.');
    if (!form.descricao?.trim()) validationErrors.push('Resumo curto é obrigatório.');
    if (!form.imagem_url?.trim()) validationErrors.push('Faça o upload da imagem de capa antes de salvar.');

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      showToastMessage(validationErrors.join(' '), 'error'); // Agora funciona
      return;
    }

    setSubmitting(true);

    let formPayload = { ...form };

    const op = editing ? 'update' : 'insert';
    const filters = editing ? [{ column: '_id', operator: 'eq', value: editing }] : []; // Use _id para filtro de update

    // Garante que o slug seja gerado se o título existir e o slug estiver vazio (para casos de projetos antigos sem slug)
    // ou se o título foi alterado e o slug precisa ser atualizado.
    if (formPayload.titulo && (!formPayload.slug || (editing && formPayload.titulo !== projects.find(p => p.id === editing)?.titulo))) {
        formPayload.slug = slugify(formPayload.titulo, { lower: true, strict: true });
    }

    // Remove id e _id do payload se for atualização para evitar problemas com o DB
    if (editing) {
        delete formPayload.id;
        delete formPayload._id;
        delete formPayload.created_at;
        delete formPayload.updated_at;
    } else {
        // Para novos projetos, o _id será gerado automaticamente pelo MongoDB/Mongoose
        // Não precisamos definir formPayload._id aqui.
    }

    if (!formPayload.link?.trim()) {
      formPayload.link = formPayload.slug.trim();
    }

    try {
      const res = await fetch(`${API_URL}/api/db/projetos/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operation: op, filters, payload: formPayload }),
      });
      if (!res.ok) {
        if (res.status === 401) signOut();
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      showToastMessage(`Projeto ${editing ? 'atualizado' : 'criado'} com sucesso.`, 'success'); // Agora funciona
      handleCancelEdit();
      await fetchProjects();
    } catch (err) {
      setError(err.message);
      showToastMessage(err.message, 'error'); // Agora funciona
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!token) {
      signOut();
      navigate('/login');
      return;
    }

    console.log('Tentando excluir projeto com ID:', projectId);

    if (window.confirm('Tem certeza? Esta ação removerá o projeto e sua galeria.')) {
      try {
        // A chamada para excluir a galeria via API genérica pode ser mantida aqui
        // OU, o ideal é que o NOVO ENDPOINT PERSONALIZADO no backend lide com a exclusão da galeria também.
        // Se o seu novo endpoint de backend já exclui a galeria, você pode remover este bloco.
        // Por enquanto, vamos mantê-lo para garantir que a galeria seja limpa.
        const galleryDeleteBody = {
          operation: 'delete',
          filters: [{ column: 'projeto_id', operator: 'eq', value: projectId }],
        };
        console.log('Requisição de exclusão da galeria (API genérica):', JSON.stringify(galleryDeleteBody));

        const galleryRes = await fetch(`${API_URL}/api/db/projeto_galeria/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(galleryDeleteBody),
        });

        if (!galleryRes.ok) {
          const errorData = await galleryRes.json();
          // Não lançar erro fatal aqui se a galeria não existir, apenas logar
          console.warn('Aviso: Erro ao deletar galeria ou galeria não encontrada:', errorData.error || `Status: ${galleryRes.status}`);
        } else {
          console.log('Galeria excluída com sucesso (ou não encontrada) via API genérica.');
        }


        // 2. Excluir o projeto principal usando o NOVO ENDPOINT PERSONALIZADO
        console.log(`Chamando DELETE ${API_URL}/api/projetos/${projectId}`);
        const projectRes = await fetch(`${API_URL}/api/projetos/${projectId}`, { // <--- NOVO ENDPOINT AQUI
          method: 'DELETE', // <--- MÉTODO HTTP AGORA É DELETE
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!projectRes.ok) {
          if (projectRes.status === 401) signOut();
          const errorData = await projectRes.json();
          throw new Error(errorData.error || `Erro ao deletar projeto: ${projectRes.status}`);
        }
        console.log('Projeto principal excluído com sucesso via endpoint personalizado.');


        showToastMessage('Projeto excluído com sucesso.', 'success'); // Agora funciona
        await fetchProjects(); // Re-carrega os projetos para atualizar a lista
      } catch (err) {
        console.error('Erro durante a exclusão do projeto:', err);
        setError(err.message);
        showToastMessage(err.message, 'error'); // Agora funciona
      }
    }
  };

  // ... (o restante do seu componente AdminProjetos, incluindo o JSX)
  return (
    <div className="admin-container">
      <h1>{editing ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</h1>
      {error && <p className="error-message">{error}</p>}
      {uploadError && <p className="error-message">{uploadError}</p>}

      {/* Renderiza o Toast se showToast for true */}
      {showToast && (
        <div className={`toast-notification toast-${toastType}`}>
          {toastMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* ... Seus campos de formulário ... */}
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug:</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={form.slug || slugify(form.titulo || '', { lower: true, strict: true })}
            readOnly // O slug é gerado automaticamente e não deve ser editado manualmente
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria:</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            name="cliente"
            value={form.cliente}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="data_projeto">Data do Projeto:</label>
          <input
            type="date"
            id="data_projeto"
            name="data_projeto"
            value={form.data_projeto}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleFieldChange}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Resumo Curto:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleFieldChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="descricao_longa">Descrição Longa (PT):</label>
          <textarea
            id="descricao_longa"
            name="descricao_longa"
            value={form.descricao_longa}
            onChange={handleFieldChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="descricao_longa_en">Descrição Longa (EN):</label>
          <textarea
            id="descricao_longa_en"
            name="descricao_longa_en"
            value={form.descricao_longa_en}
            onChange={handleFieldChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="imagem_url">URL da Imagem de Capa:</label>
          <input
            type="text"
            id="imagem_url"
            name="imagem_url"
            value={form.imagem_url}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="site_url">URL do Site (Opcional):</label>
          <input
            type="text"
            id="site_url"
            name="site_url"
            value={form.site_url}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link do Projeto (Behance/Outro):</label>
          <input
            type="text"
            id="link"
            name="link"
            value={form.link}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="button_text">Texto do Botão do Link:</label>
          <input
            type="text"
            id="button_text"
            name="button_text"
            value={form.button_text}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="link2">Segundo Link (Opcional):</label>
          <input
            type="text"
            id="link2"
            name="link2"
            value={form.link2}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="button_text2">Texto do Segundo Botão:</label>
          <input
            type="text"
            id="button_text2"
            name="button_text2"
            value={form.button_text2}
            onChange={handleFieldChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="mostrar_home"
            name="mostrar_home"
            checked={form.mostrar_home}
            onChange={handleFieldChange}
          />
          <label htmlFor="mostrar_home">Mostrar na Home?</label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : (editing ? 'Atualizar Projeto' : 'Publicar Projeto')}
          </button>
          {editing && (
            <button type="button" onClick={handleCancelEdit} disabled={submitting}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <h2>Projetos Existentes</h2>
      {loading ? (
        <p>Carregando projetos...</p>
      ) : (
        <ul className="project-list">
          {projects.map((proj) => (
            <li key={proj.id} className="project-item">
              <span>{proj.titulo}</span>
              <div className="project-actions">
                <button onClick={() => handleEditProject(proj)} title="Editar">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteProject(proj.id)} title="Excluir">
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProjetos;