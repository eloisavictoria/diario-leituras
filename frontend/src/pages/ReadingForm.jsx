import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { request } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import Stars from '../components/Stars.jsx';
const EMPTY = { title: '', author: '', genre: '', opinion: '', rating: 0, recommend: null };
export default function ReadingForm() {
  const { id } = useParams(); const editing = Boolean(id); const navigate = useNavigate(); const { auth, logout } = useAuth();
  const [form, setForm] = useState(EMPTY); const [genres, setGenres] = useState([]); const [loading, setLoading] = useState(editing); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  useEffect(() => { let active = true; request('/genres').then(data => { if (active) setGenres(data); }).catch(err => { if (active) setError(err.message); }); return () => { active = false; }; }, []);
  useEffect(() => {
    if (!editing) return;
    let active = true;
    request(`/readings/${id}`, { token: auth.token }).then(data => { if (active) setForm({ title: data.title, author: data.author, genre: data.genre, opinion: data.opinion, rating: data.rating, recommend: data.recommend }); }).catch(err => { if (active) { setError(err.message); if (err.status === 401) logout(); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, editing, auth.token]);
  function change(key, value) { setForm(prev => ({ ...prev, [key]: value })); }
  async function submit(event) {
    event.preventDefault(); setError('');
    if (!form.title.trim() || !form.author.trim() || !form.opinion.trim() || !genres.includes(form.genre) || !Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5 || typeof form.recommend !== 'boolean') { setError('Preencha todos os campos, incluindo a avaliação e a recomendação.'); return; }
    setSaving(true);
    try {
      const data = await request(editing ? `/readings/${id}` : '/readings', { token: auth.token, method: editing ? 'PUT' : 'POST', body: JSON.stringify({ ...form, title: form.title.trim(), author: form.author.trim(), opinion: form.opinion.trim() }) });
      navigate(`/readings/${data._id}`, { replace: true });
    } catch (err) { setError(err.message); if (err.status === 401) logout(); } finally { setSaving(false); }
  }
  return <div className="narrow-page"><Link to={editing ? `/readings/${id}` : '/library'} className="back-link"><ArrowLeft size={17}/> Voltar</Link><div className="eyebrow">DIÁRIO DE LEITURAS</div><h1>{editing ? 'Editar leitura' : 'Registrar nova leitura'}<span className="brand-dot">.</span></h1><p className="page-subtitle">{editing ? 'Atualize as informações e sua experiência com este livro.' : 'Todo livro merece um espaço na memória. Conte um pouco sobre o seu.'}</p>
    {loading ? <p className="state-text">Carregando leitura...</p> : <form onSubmit={submit} className="form-card"><h2>Sobre o livro</h2>{error && <div className="error-banner" role="alert">{error}</div>}
      <div className="field"><label htmlFor="title">Título do livro <b>*</b></label><input id="title" maxLength="200" value={form.title} onChange={e => change('title', e.target.value)} placeholder="Ex.: O Hobbit" required/></div>
      <div className="field"><label htmlFor="author">Autor <b>*</b></label><input id="author" maxLength="200" value={form.author} onChange={e => change('author', e.target.value)} placeholder="Ex.: J. R. R. Tolkien" required/></div>
      <div className="field"><label htmlFor="genre">Gênero <b>*</b></label><select id="genre" value={form.genre} onChange={e => change('genre', e.target.value)} required><option value="">Selecione um gênero</option>{genres.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
      <div className="field"><label htmlFor="opinion">Sua opinião <b>*</b></label><textarea id="opinion" rows="5" maxLength="5000" value={form.opinion} onChange={e => change('opinion', e.target.value)} placeholder="O que você achou da leitura?" required/></div>
      <div className="field"><label>Avaliação <b>*</b></label><Stars value={form.rating} interactive onChange={v => change('rating', v)}/><small>Selecione de 1 a 5 estrelas</small></div>
      <fieldset className="field radio-field"><legend>Você recomendaria este livro? <b>*</b></legend><label><input type="radio" name="recommend" checked={form.recommend === true} onChange={() => change('recommend', true)} required/> Sim, recomendo</label><label><input type="radio" name="recommend" checked={form.recommend === false} onChange={() => change('recommend', false)} required/> Não recomendo</label></fieldset>
      <div className="form-actions"><Link className="btn btn-secondary" to={editing ? `/readings/${id}` : '/library'}>Cancelar</Link><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : <><Save size={17}/> {editing ? 'Salvar alterações' : 'Salvar leitura'}</>}</button></div>
    </form>}
  </div>;
}
