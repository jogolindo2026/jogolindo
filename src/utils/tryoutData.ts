import { TryoutEvent, PlayerPosition } from '../types';

const brazilianStates = [
  'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 
  'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina',
  'Goiás', 'Maranhão', 'Espírito Santo', 'Paraíba', 'Amazonas'
];

const regions = {
  'Sudeste': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Espírito Santo'],
  'Sul': ['Rio Grande do Sul', 'Santa Catarina', 'Paraná'],
  'Nordeste': ['Bahia', 'Pernambuco', 'Ceará', 'Paraíba', 'Maranhão'],
  'Norte': ['Pará', 'Amazonas'],
  'Centro-Oeste': ['Goiás']
};

const clubs = [
  'Flamengo', 'Palmeiras', 'São Paulo FC', 'Corinthians', 'Santos FC',
  'Grêmio', 'Internacional', 'Atlético-MG', 'Cruzeiro', 'Botafogo',
  'Vasco da Gama', 'Fluminense', 'Bahia', 'Sport Recife', 'Ceará SC',
  'Fortaleza EC', 'Athletico-PR', 'Coritiba', 'Chapecoense', 'Avaí'
];

const venues = [
  'CT Barra Funda', 'Ninho do Urubu', 'CT Joaquim Grava', 'CT Dr. Joaquim Grava',
  'Vila Belmiro', 'CT Luiz Carvalho', 'CT Parque Gigante', 'Cidade do Galo',
  'Toca da Raposa', 'CT General Severiano', 'CT Carlos Castilho', 'CT Vale das Laranjeiras',
  'CT Evaristo de Macedo', 'CT José de Andrade Médicis', 'CT Ribamar Bezerra',
  'CT Ribamar Bezerra', 'CT do Caju', 'CT Academia de Futebol', 'Arena Condá', 'CT do Avaí'
];

function getRandomDate(daysFromNow: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow) + 1);
  return date.toISOString().split('T')[0];
}

function getRandomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 8; // 8-19h
  const minutes = Math.random() > 0.5 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function getRandomPositions(): PlayerPosition[] {
  const allPositions: PlayerPosition[] = ['goalkeeper', 'defender', 'midfielder', 'forward'];
  const numPositions = Math.floor(Math.random() * 3) + 1; // 1-3 positions
  const shuffled = [...allPositions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numPositions);
}

function getRegionForState(state: string): string {
  for (const [region, states] of Object.entries(regions)) {
    if (states.includes(state)) {
      return region;
    }
  }
  return 'Outros';
}

function generateTryoutEvent(id: string): TryoutEvent {
  const club = clubs[Math.floor(Math.random() * clubs.length)];
  const state = brazilianStates[Math.floor(Math.random() * brazilianStates.length)];
  const region = getRegionForState(state);
  const venue = venues[Math.floor(Math.random() * venues.length)];
  const date = getRandomDate();
  const time = getRandomTime();
  
  // Generate realistic city names based on state
  const cities = {
    'São Paulo': ['São Paulo', 'Campinas', 'Santos', 'São Bernardo do Campo', 'Guarulhos'],
    'Rio de Janeiro': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Campos dos Goytacazes'],
    'Minas Gerais': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
    'Bahia': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Jequié'],
    'Paraná': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
    'Rio Grande do Sul': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
    'Pernambuco': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
    'Ceará': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
    'Pará': ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas'],
    'Santa Catarina': ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma'],
    'Goiás': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'],
    'Maranhão': ['São Luís', 'Imperatriz', 'Timon', 'Caxias', 'Codó'],
    'Espírito Santo': ['Vitória', 'Vila Velha', 'Cariacica', 'Serra', 'Linhares'],
    'Paraíba': ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux'],
    'Amazonas': ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari']
  };
  
  const cityList = cities[state as keyof typeof cities] || [state];
  const city = cityList[Math.floor(Math.random() * cityList.length)];
  
  const ageRanges = ['12-15 anos', '16-18 anos', '17-20 anos', '18-23 anos', 'Livre'];
  const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
  
  const maxParticipants = Math.floor(Math.random() * 100) + 50; // 50-150
  const currentParticipants = Math.floor(Math.random() * maxParticipants * 0.8); // Up to 80% filled
  
  const requirements = [
    'Documento de identidade',
    'Atestado médico',
    'Autorização dos pais (menores de idade)',
    'Chuteira e material esportivo',
    'Taxa de inscrição'
  ];
  
  const selectedRequirements = requirements.slice(0, Math.floor(Math.random() * 3) + 3);
  
  const cost = Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 20 : 0; // 70% paid, 30% free
  
  const registrationDeadline = new Date(date);
  registrationDeadline.setDate(registrationDeadline.getDate() - Math.floor(Math.random() * 7) - 1);
  
  const contactNames = [
    'Carlos Silva', 'Ana Santos', 'Roberto Oliveira', 'Mariana Costa', 'João Pedro',
    'Fernanda Lima', 'Ricardo Almeida', 'Juliana Ferreira', 'Paulo Martins', 'Camila Souza'
  ];
  
  const images = [
    'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
    'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
    'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg',
    'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
    'https://images.pexels.com/photos/3621121/pexels-photo-3621121.jpeg',
    'https://images.pexels.com/photos/8224167/pexels-photo-8224167.jpeg'
  ];
  
  return {
    id,
    title: `Peneira ${club}`,
    description: `Seletiva oficial do ${club} para captação de novos talentos. Avaliação técnica, tática e física com comissão técnica especializada.`,
    club,
    date,
    time,
    location: venue,
    address: `${venue}, ${city} - ${state}`,
    city,
    state,
    region,
    ageRange,
    positions: getRandomPositions(),
    maxParticipants,
    currentParticipants,
    registrationDeadline: registrationDeadline.toISOString().split('T')[0],
    requirements: selectedRequirements,
    contact: {
      name: contactNames[Math.floor(Math.random() * contactNames.length)],
      phone: `(${Math.floor(Math.random() * 89) + 11}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `peneira@${club.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com.br`
    },
    cost,
    isActive: Math.random() > 0.1, // 90% active
    imageUrl: images[Math.floor(Math.random() * images.length)]
  };
}

export function generateTryoutData(): TryoutEvent[] {
  const tryouts: TryoutEvent[] = [];
  
  for (let i = 1; i <= 50; i++) {
    tryouts.push(generateTryoutEvent(i.toString()));
  }
  
  // Sort by date
  return tryouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function filterTryoutsByLocation(tryouts: TryoutEvent[], searchCity: string, searchState: string): TryoutEvent[] {
  if (!searchCity && !searchState) return tryouts;
  
  return tryouts.filter(tryout => {
    const cityMatch = !searchCity || tryout.city.toLowerCase().includes(searchCity.toLowerCase());
    const stateMatch = !searchState || tryout.state.toLowerCase().includes(searchState.toLowerCase());
    return cityMatch && stateMatch;
  });
}

export function filterTryoutsByRegion(tryouts: TryoutEvent[], region: string): TryoutEvent[] {
  if (!region || region === 'all') return tryouts;
  return tryouts.filter(tryout => tryout.region === region);
}

export function getPositionLabel(position: PlayerPosition): string {
  const labels = {
    goalkeeper: 'Goleiro',
    defender: 'Defensor',
    midfielder: 'Meio-campo',
    forward: 'Atacante'
  };
  return labels[position];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function isRegistrationOpen(deadline: string): boolean {
  return new Date(deadline) > new Date();
}

export function getRegions(): string[] {
  return Object.keys(regions);
}