import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
export default function Login() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (auth) return <Navigate to="/library" replace />;
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/library', { replace: true }); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <div className="login-page"><div className="login-panel">
    <div className="login-logo"><BookOpen size={29}/></div><div className="eyebrow">SEU CANTINHO LITERÁRIO</div>
    <h1>Histórias que ficam<br/><em>com você.</em></h1><p className="login-intro">Guarde suas leituras, revisite suas impressões e celebre cada livro que marcou sua jornada.</p>
    <form onSubmit={submit} className="login-form">
      <h2>Entre na sua biblioteca</h2>
      {error && <div role="alert" className="error-banner">{error}</div>}
      <label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required/>
      <label htmlFor="password">Senha</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" required/>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Entrando...' : 'Entrar na biblioteca'} <ArrowRight size={17}/></button>
    </form><p className="login-hint">Projeto de demonstração · Consulte as credenciais no README.</p>
  </div><div className="login-art" aria-hidden="true"><div className="art-quote">“Um leitor vive mil vidas antes de morrer.”</div><div className="book-stack"><div className="book book-a"/><div className="book book-b"/><div className="book book-c"/><div className="book book-d"/></div><div className="art-caption">CADA PÁGINA CONTA UMA HISTÓRIA</div></div></div>;
}
