import Projeto from './Projeto.js';
import ProjetoGaleria from './ProjetoGaleria.js';
import Post from './Post.js';
import Autor from './Autor.js';
import Depoimento from './Depoimento.js';
import AdminUser from './AdminUser.js';
import Upload from './Upload.js';
import Comment from './Comment.js';
import FAQ from './FAQ.js';

export const tableModelMap = {
  projetos: Projeto,
  projeto_galeria: ProjetoGaleria,
  posts: Post,
  autores: Autor,
  depoimentos: Depoimento,
};

export {
  Projeto,
  ProjetoGaleria,
  Post,
  Autor,
  Depoimento,
  AdminUser,
  Upload,
  Comment,
  FAQ,
};
