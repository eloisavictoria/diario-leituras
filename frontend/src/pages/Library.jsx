import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, BookOpen, Plus } from 'lucide-react';
import { request } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Stars from '../components/Stars.jsx';
export default function Library() {
  const { auth, logout } = useAuth();
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    request('/readings', { token: auth.token }).then(data => { if (active) setItems(data); }).catch(err => { if (active) { setError(err.message); if (err.status === 401) logout(); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [auth.token]);
  return <><div className="page-heading"><div><div className="eyebrow">SEU UNIVERSO DE HISTÓRIAS</div><h1>Minha biblioteca<span className="brand-dot">.</span></h1><p>Um lugar para guardar as leituras que fizeram parte da sua história.</p></div><Link className="btn btn-primary" to="/readings/new"><Plus size={18}/> Registrar leitura</Link></div>
    {!loading && !error && <div className="library-summary"><span className="summary-icon"><BookMarked size={22}/></span><div><strong>{items.length} {items.length === 1 ? 'livro registrado' : 'livros registrados'}</strong><span> Sua coleção pessoal de leituras</span></div></div>}
    {loading && <p role="status" className="state-text">Carregando sua biblioteca...</p>}
    {error && <div className="error-banner" role="alert">{error}</div>}
    {!loading && !error && items.length === 0 && <div className="empty-state"><BookOpen size={39}/><h2>Sua biblioteca está esperando uma história.</h2><p>Você ainda não registrou nenhum livro. Comece com sua leitura favorita.</p><Link className="btn btn-primary" to="/readings/new"><Plus size={18}/> Adicionar primeiro livro</Link></div>}
    {!loading && !error && items.length > 0 && <section className="reading-grid" aria-label="Leituras registradas">{items.map((item, index) => <article key={item._id} className="reading-card"><div className={`card-cover cover-${index % 5}`}><BookOpen size={36}/><span>ENTRE PÁGINAS</span></div><div className="card-body"><span className="genre-label">{item.genre}</span><h2>{item.title}</h2><p className="card-author">por {item.author}</p><Stars value={item.rating}/><p className={`recommend-label ${item.recommend ? 'positive' : 'muted'}`}>{item.recommend ? '✓ Recomendo' : '— Não recomendo'}</p><Link className="card-link" to={`/readings/${item._id}`}>Ver detalhes <ArrowRight size={16}/></Link></div></article>)}</section>}
  </>;
}
