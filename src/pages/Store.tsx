import React from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Store: React.FC = () => {
  const retailers = [
    {
      name: 'Nike',
      description: 'Equipamentos de elite e a linha oficial de chuteiras e vestuário para futebol profissional.',
      image: '/nike.png', // Agora lendo seu arquivo local
      url: 'https://www.nike.com.br/'
    },
    {
      name: 'Adidas',
      description: 'Tecnologia de ponta em acessórios e uniformes para maximizar sua performance em campo.',
      image: '/adidas.png', // Agora lendo seu arquivo local
      url: 'https://www.adidas.com.br/'
    },
    {
      name: 'Puma',
      description: 'Inovação e estilo com as melhores opções de equipamentos para atletas de alto nível.',
      image: '/puma.png', // Agora lendo seu arquivo local
      url: 'https://br.puma.com/'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <ShoppingBag size={40} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat uppercase tracking-tight">
            Loja <span className="text-green-600">Oficial</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Equipamentos esportivos de alta qualidade selecionados especialmente para nossos atletas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {retailers.map((retailer) => (
            <Card key={retailer.name} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none group">
              {/* O segredo do zoom está aqui: overflow-hidden no pai e transition na img */}
              <div className="relative h-64 w-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={retailer.image}
                  alt={retailer.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
              
              <CardBody className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat uppercase">{retailer.name}</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed h-12">
                  {retailer.description}
                </p>
                <a
                  href={retailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="primary"
                    fullWidth
                    className="bg-green-700 hover:bg-green-800 text-white border-none py-4 font-bold"
                    rightIcon={<ExternalLink size={18} />}
                  >
                    VISITAR LOJA
                  </Button>
                </a>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8 flex items-start space-x-4 shadow-sm">
          <ShieldCheck size={32} className="text-green-600 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-montserrat uppercase tracking-wider text-sm">Informação Importante</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              O <strong>Jogo Lindo</strong> redireciona você apenas para os domínios oficiais. 
              A segurança do pagamento e a entrega dos produtos são garantidas pelas respectivas marcas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;