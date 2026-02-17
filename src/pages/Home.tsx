import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Video, Trophy, Calendar, ShoppingBag, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    document.title = "Jogo Lindo | Escola de Futebol";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img 
            src="https://images.pexels.com/photos/50713/football-ball-sport-soccer-50713.jpeg" 
            alt="Futebol"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              JOGO LINDO
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Escola de futebol para crianças e jovens. Formando atletas e cidadãos através da paixão pelo esporte.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/cadastro">
                  <Button variant="secondary" size="lg">
                    Cadastre-se
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link to="/aulas">
                  <Button variant="secondary" size="lg">
                    Ver aulas
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <img 
                src="https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg"
                alt="Instrutor de futebol"
                className="w-full h-full object-cover opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4 inline-block">
                    <Play size={48} className="text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Conheça o Jogo Lindo
                  </h2>
                  <p className="text-white/80">
                    Assista nossa apresentação e descubra como podemos ajudar no seu desenvolvimento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Por que escolher o Jogo Lindo?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa metodologia exclusiva desenvolve não apenas habilidades técnicas, mas também valores como disciplina, trabalho em equipe e cidadania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aulas em Vídeo</h3>
                <p className="text-gray-600">
                  Acesso a mais de 100 vídeos com técnicas e treinos desenvolvidos por profissionais.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ranking de Talentos</h3>
                <p className="text-gray-600">
                  Destaque-se no ranking e seja visto por olheiros e clubes profissionais.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Peneiras</h3>
                <p className="text-gray-600">
                  Informações sobre seletivas e testes em clubes do Brasil e do exterior.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loja</h3>
                <p className="text-gray-600">
                  Produtos exclusivos e equipamentos esportivos de alta qualidade.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Modules Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Nossos Módulos de Ensino
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Uma formação completa que vai além das habilidades técnicas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/50713/football-ball-sport-soccer-50713.jpeg" 
                alt="Técnicas de futebol"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <CardBody>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Técnicas</h3>
                <p className="text-gray-600 mb-4">
                  Domine os fundamentos do futebol: controle de bola, passes, finalizações e dribles que farão você se destacar em campo.
                </p>
                <Link to={isAuthenticated ? "/aulas" : "/cadastro"}>
                  <Button variant="primary">
                    {isAuthenticated ? "Ver aulas" : "Cadastre-se para acessar"}
                  </Button>
                </Link>
              </CardBody>
            </Card>
            
            <Card className="overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg" 
                alt="Táticas de futebol"
                className="w-full h-64 object-cover"
              />
              <CardBody>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Táticas</h3>
                <p className="text-gray-600 mb-4">
                  Entenda os sistemas táticos modernos, posicionamento em campo e estratégias coletivas que fazem a diferença no jogo.
                </p>
                <Link to={isAuthenticated ? "/aulas" : "/cadastro"}>
                  <Button variant="primary">
                    {isAuthenticated ? "Ver aulas" : "Cadastre-se para acessar"}
                  </Button>
                </Link>
              </CardBody>
            </Card>
            
            <Card className="overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/774321/pexels-photo-774321.jpeg" 
                alt="Saúde no esporte"
                className="w-full h-64 object-cover"
              />
              <CardBody>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Saúde</h3>
                <p className="text-gray-600 mb-4">
                  Nutrição, preparação física, prevenção de lesões e tudo o que você precisa para manter seu corpo no auge do desempenho.
                </p>
                <Link to={isAuthenticated ? "/aulas" : "/cadastro"}>
                  <Button variant="primary">
                    {isAuthenticated ? "Ver aulas" : "Cadastre-se para acessar"}
                  </Button>
                </Link>
              </CardBody>
            </Card>
            
            <Card className="overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/27642344/pexels-photo-27642344.jpeg" 
                alt="Cidadania através do esporte"
                className="w-full h-64 object-cover"
              />
              <CardBody>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Cidadania</h3>
                <p className="text-gray-600 mb-4">
                  Desenvolvimento de valores éticos, fair play, trabalho em equipe e como o futebol pode contribuir para uma sociedade melhor.
                </p>
                <Link to={isAuthenticated ? "/aulas" : "/cadastro"}>
                  <Button variant="primary">
                    {isAuthenticated ? "Ver aulas" : "Cadastre-se para acessar"}
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-accent-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Pronto para dar o próximo passo na sua carreira?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de jovens que estão desenvolvendo seu potencial com o Jogo Lindo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={isAuthenticated ? "/aulas" : "/cadastro"}>
              <Button variant="secondary" size="lg">
                {isAuthenticated ? "Acessar aulas" : "Cadastre-se agora"}
              </Button>
            </Link>
            <Link to="/sobre">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                Saiba mais
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;