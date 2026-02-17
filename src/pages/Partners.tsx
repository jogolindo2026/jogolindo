import { Handshake, BarChart3, Cpu, ShoppingBag, Users, Globe, Award } from 'lucide-react';

const Partners = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Framework Jogolindo</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto mb-8 font-light">
            A primeira plataforma gamificada que une <strong className="font-bold text-white">Ex-Craques do Futebol</strong> e <strong className="font-bold text-white">Inteligência Artificial</strong> para transformar jovens talentos em cidadãos e atletas profissionais.
          </p>
          <div className="flex justify-center gap-4">
            <span className="bg-green-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">Lançamento Copa 2026</span>
          </div>
        </div>
      </section>

      {/* Os 4 Pilares da Parceria */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Onde a Tecnologia encontra o Campo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <BarChart3 className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Business Intelligence</h3>
            <p className="text-gray-600">Acesso a dashboards inteligentes com Scores de Pontuação personalizados e dados demográficos de alto valor agregado.</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <Cpu className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Análise IA</h3>
            <p className="text-gray-600">Análise fisiológica de movimentos via IA, oferecendo feedbacks técnicos e sugestões de correção em tempo real.</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <ShoppingBag className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Marketplace Direto</h3>
            <p className="text-gray-600">Canal de marketing segmentado para venda de materiais esportivos e suplementos adequados ao perfil de cada atleta.</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <Handshake className="w-12 h-12 text-green-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Aliança de Talentos</h3>
            <p className="text-gray-600">Equipe os destaques do ranking com materiais diferenciados, fidelizando a futura elite do esporte desde a base.</p>
          </div>
        </div>
      </section>

      {/* Seção de Autoridade e Social */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <Users className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Mestres do Futebol</h4>
            <p className="text-sm text-gray-600">Conteúdo ministrado por treinadores renomados que já formaram craques de sucesso no mercado.</p>
          </div>
          <div>
            <Award className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Formação Integral</h4>
            <p className="text-sm text-gray-600">Foco em técnica, tática, saúde física e comportamento psicológico/cidadania.</p>
          </div>
          <div>
            <Globe className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Peneira Digital</h4>
            <p className="text-sm text-gray-600">Rede social de vídeos que permite a descoberta de talentos por empresários e clubes globalmente.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;