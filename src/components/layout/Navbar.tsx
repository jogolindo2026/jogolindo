import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Menu,  
  LogOut, 
  Handshake 
} from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
  logout(); // Limpa a sessão no store/Supabase
  navigate('/'); // Alterado de '/login' para '/'
  setIsMenuOpen(false); // Fecha o menu mobile, se estiver aberto
};
  
  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img src="/logotipo.png" alt="Logo" className="h-14 w-auto group-hover:scale-105 transition-transform" />
              <span className="ml-2 text-xl font-heading font-bold tracking-tighter">
                JOGO <span className="text-secondary-400">LINDO</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/parceiros" className="flex items-center px-2 py-2 rounded-md text-xs font-bold text-secondary-400 hover:bg-primary-700 transition-colors">
              <Handshake size={16} className="mr-1" /> PARCEIROS
            </Link>
            <Link to="/sobre" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">SOBRE</Link>
            <Link to="/aulas" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">AULAS</Link>
            <Link to="/social" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">SOCIAL</Link>
            <Link to="/ranking" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">RANKING</Link>
            <Link to="/peneiras" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">PENEIRAS</Link>
            <Link to="/loja" className="px-2 py-2 rounded-md text-xs font-medium hover:bg-primary-700 transition-colors">LOJA</Link>

            {isAuthenticated ? (
              <div className="flex items-center ml-2 pl-2 border-l border-primary-400">
                <Link to="/perfil" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <img 
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}&background=EAB308&color=000`} 
                    className="w-8 h-8 rounded-full border-2 border-secondary-500 object-cover"
                    alt="Perfil"
                  />
                  <span className="text-xs font-bold truncate max-w-[70px] uppercase">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="ml-3 p-1 hover:text-secondary-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-2">
                <Button variant="secondary" size="sm" className="font-bold text-xs uppercase">Entrar</Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2"><Menu size={28} /></button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-primary-700 border-t border-primary-500 p-4 space-y-2">
           {['Parceiros', 'Sobre', 'Aulas', 'Social', 'Ranking', 'Peneiras', 'Loja'].map((item) => (
             <Link key={item} to={`/${item.toLowerCase()}`} className="block p-3 text-white font-medium border-b border-primary-600" onClick={toggleMenu}>
               {item.toUpperCase()}
             </Link>
           ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;