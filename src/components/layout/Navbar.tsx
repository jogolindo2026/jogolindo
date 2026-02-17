import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Menu, 
  X, 
  LogOut, 
  Handshake,
  Target,
  BookOpen,
  Video,
  Award
} from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo e Nome do Projeto */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Target size={32} className="text-secondary-400 group-hover:rotate-12 transition-transform" />
              <span className="ml-2 text-xl font-heading font-bold tracking-tighter">
                JOGO <span className="text-secondary-400">LINDO</span>
              </span>
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            
            <Link to="/parceiros" className="flex items-center px-3 py-2 rounded-md text-xs font-bold text-secondary-400 hover:bg-primary-700 transition-colors">
              <Handshake size={16} className="mr-1" />
              PARCEIROS
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/aulas" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">Aulas</Link>
                <Link to="/social" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">Social</Link>
                <Link to="/ranking" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">Ranking</Link>
                <Link to="/loja" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">Loja</Link>
                
                {/* Avatar do Usuário */}
                <div className="flex items-center ml-4 pl-4 border-l border-primary-400">
                  <Link to="/perfil" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <img 
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}&background=EAB308&color=000`} 
                      className="w-8 h-8 rounded-full border-2 border-secondary-500 object-cover"
                      alt="Perfil"
                    />
                    <span className="text-sm font-bold truncate max-w-[100px]">
                      {user?.name?.split(' ')[0] || 'Atleta'}
                    </span>
                  </Link>
                  <button onClick={handleLogout} className="ml-4 p-1 hover:text-secondary-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/sobre" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700">Sobre</Link>
                <Link to="/login" className="ml-2">
                  <Button variant="secondary" size="sm" className="font-bold">ENTRAR</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-700 border-t border-primary-500 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center p-3 border-b border-primary-500 mb-2">
                  <img src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}`} className="w-10 h-10 rounded-full mr-3" alt="" />
                  <div>
                    <p className="font-bold">{user?.name}</p>
                    <Link to="/perfil" onClick={toggleMenu} className="text-xs text-secondary-400 underline">Ver meu perfil</Link>
                  </div>
                </div>
                <Link to="/aulas" className="flex items-center p-3 text-white" onClick={toggleMenu}><BookOpen size={20} className="mr-3"/> Aulas</Link>
                <Link to="/social" className="flex items-center p-3 text-white" onClick={toggleMenu}><Video size={20} className="mr-3"/> Social</Link>
                <Link to="/ranking" className="flex items-center p-3 text-white" onClick={toggleMenu}><Award size={20} className="mr-3"/> Ranking</Link>
                <button onClick={handleLogout} className="flex w-full items-center p-3 text-secondary-400 font-bold"><LogOut size={20} className="mr-3"/> SAIR</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block p-3 text-white text-center font-bold border border-white rounded-md" onClick={toggleMenu}>ENTRAR</Link>
                <Link to="/cadastro" className="block p-3 bg-secondary-500 text-primary-900 text-center font-bold rounded-md" onClick={toggleMenu}>CADASTRAR</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;