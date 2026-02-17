import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/logotipo.png" 
                alt="Logo Jogo Lindo" 
                className="h-10 w-auto" 
              />
              <span className="ml-2 text-xl font-heading font-bold">JOGO <span className="text-secondary-500">LINDO</span></span>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              Escola de futebol para crianças e jovens. Formando atletas e cidadãos através da paixão pelo esporte.
            </p>
            <div className="flex space-x-4">
              <span className="text-gray-600 cursor-not-allowed"><Instagram size={20} /></span>
              <span className="text-gray-600 cursor-not-allowed"><Facebook size={20} /></span>
              <span className="text-gray-600 cursor-not-allowed"><Twitter size={20} /></span>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              {/* Substituído Aulas por Social conforme solicitado */}
              <li><Link to="/social" className="text-gray-400 hover:text-white transition-colors">Social</Link></li>
              <li><Link to="/loja" className="text-gray-400 hover:text-white transition-colors">Loja</Link></li>
              <li><Link to="/ranking" className="text-gray-400 hover:text-white transition-colors">Ranking</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={20} className="mt-1 mr-3 flex-shrink-0 text-secondary-500" />
                <div className="text-gray-400 leading-relaxed">
                  <div>Flamengo</div>
                  <div>Rio de Janeiro, Brasil</div>
                </div>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0 text-secondary-500" />
                <span className="text-gray-400">21 96687-9813</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0 text-secondary-500" />
                <span className="text-gray-400 break-all">jogolindo2026@gmail.com</span>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Desenvolvimento</h3>
            <p className="text-gray-400 text-sm mb-2">Este projeto foi desenvolvido por:</p>
            <a 
              href="https://saintsolution.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary-500 font-bold hover:underline"
            >
              SaintSolution Soluções Digitais
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jogo Lindo. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/sobre" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/sobre" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;