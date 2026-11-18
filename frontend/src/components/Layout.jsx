import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
export default function Layout() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="app-shell">
    <header className="topbar"><div className="header-inner">
      <Link to="/library" className="brand"><span className="brand-mark"><BookOpen size={20}/></span> Entre Páginas<span className="brand-dot">.</span></Link>
      <nav aria-label="Navegação principal" className="nav-actions"><NavLink to="/library" className="nav-link">Minha biblioteca</NavLink><Link to="/readings/new" className="btn btn-primary btn-small"><Plus size={16}/> Nova leitura</Link><span className="user-chip" title={auth?.user.email}>{auth?.user.name}</span><button type="button" className="icon-button" onClick={() => { logout(); navigate('/login'); }} title="Sair" aria-label="Sair"><LogOut size={19}/></button></nav>
    </div></header>
    <main className="content"><Outlet/></main>
    <footer className="footer">Entre Páginas · Seu diário pessoal de leituras</footer>
  </div>;
}
