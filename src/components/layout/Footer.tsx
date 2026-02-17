import React from 'react';
import { Link } from 'react-router-dom';
import { Wallpaper as BallSoccer, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <BallSoccer size={32} className="text-secondary-500" />
              <span className="ml-2 text-xl font-heading font-bold">JOGO LINDO</span>
            </div>
            <p className="text-gray-400 mb-4">
              Escola de futebol para crianças e jovens. Desenvolvimento técnico, tático e valores humanos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/aulas" className="text-gray-400 hover:text-white transition-colors">
                  Aulas
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-gray-400 hover:text-white transition-colors">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/peneiras" className="text-gray-400 hover:text-white transition-colors">
                  Peneiras
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mt-1 mr-3 flex-shrink-0 text-secondary-500" />
                <div className="text-gray-400 leading-relaxed">
                  <div>Av. Paulista, 1000</div>
                  <div>São Paulo, SP, 01310-100</div>
                </div>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0 text-secondary-500" />
                <span className="text-gray-400">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0 text-secondary-500" />
                <span className="text-gray-400 break-all">contato@jogolindo.com.br</span>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-between items-center">
                <span className="mr-2">Segunda - Sexta:</span>
                <span className="text-right">08:00 - 20:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="mr-2">Sábado:</span>
                <span className="text-right">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="mr-2">Domingo:</span>
                <span className="text-right">Fechado</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Jogo Lindo. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;