import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ConsentBanner from './components/ConsentBanner';
import './styles/global.css';

const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Login = lazy(() => import('./pages/Login'));
const AdminProjetos = lazy(() => import('./pages/admin/AdminProjetos'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminDepoimentos = lazy(() => import('./pages/admin/AdminDepoimentos'));
const AdminAutores = lazy(() => import('./pages/admin/AdminAutores'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const BusinessCard = lazy(() => import('./pages/BusinessCard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacidade = lazy(() => import('./pages/Privacidade'));
const Termos = lazy(() => import('./pages/Termos'));
const ExclusaoDados = lazy(() => import('./pages/ExclusaoDados'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PacoteMarca = lazy(() => import('./pages/PacoteMarca'));
const PlanosPacotes = lazy(() => import('./pages/PlanosPacotes'));
const FAQ = lazy(() => import('./pages/FAQ'));
const FormularioInteresse = lazy(() => import('./pages/FormularioInteresse'));
const Contato = lazy(() => import('./pages/Contato'));
const Processos = lazy(() => import('./pages/Processos'));
const AdminComentarios = lazy(() => import('./pages/admin/AdminComentarios'));
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'));
const Agradecimento = lazy(() => import('./pages/Agradecimento'));
const Diagnostico = lazy(() => import('./pages/Diagnostico'));


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center text-white text-xl">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/agenda" element={<Schedule />} /> */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/cartao" element={<BusinessCard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/agradecimento" element={<Agradecimento />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/exclusao-dados" element={<ExclusaoDados />} />
              <Route path="/processos" element={<Processos />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projetos" 
                element={
                  <ProtectedRoute>
                    <AdminProjetos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blog" 
                element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/depoimentos" 
                element={
                  <ProtectedRoute>
                    <AdminDepoimentos />
                  </ProtectedRoute>
                } 
              />
              <Route path="/contato" element={<Contato />} />
              <Route path="/formulario-interesse" element={<FormularioInteresse />} />
              <Route 
                path="/admin/autores" 
                element={
                  <ProtectedRoute>
                    <AdminAutores />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/comentarios"
                element={
                  <ProtectedRoute>
                    <AdminComentarios />
                  </ProtectedRoute>
                } 
              />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/pacote-marca" element={<PacoteMarca />} />
              <Route path="/planos-pacotes" element={<PlanosPacotes />} />
              <Route 
                path="/admin/faq" 
                element={
                  <ProtectedRoute>
                    <AdminFAQ />
                  </ProtectedRoute>
                }
              />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ConsentBanner />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
