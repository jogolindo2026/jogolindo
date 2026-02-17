import { User, VideoLesson, UserVideo, Product, TryoutEvent } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'neymar@example.com',
    name: 'Neymar Jr.',
    role: 'player',
    phone: '+55 11 99999-1111',
    gender: 'male',
    birthDate: '1992-02-05',
    country: 'Brasil',
    city: 'São Paulo',
    position: 'forward',
    profilePicture: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    email: 'marta@example.com',
    name: 'Marta Silva',
    role: 'player',
    phone: '+55 11 99999-2222',
    gender: 'female',
    birthDate: '1986-02-19',
    country: 'Brasil',
    city: 'Rio de Janeiro',
    position: 'forward',
    profilePicture: 'https://images.pexels.com/photos/3621121/pexels-photo-3621121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-01-20',
  },
  {
    id: '3',
    email: 'scout@example.com',
    name: 'Carlos Oliveira',
    role: 'businessman',
    phone: '+55 11 99999-3333',
    gender: 'male',
    country: 'Brasil',
    city: 'Belo Horizonte',
    profilePicture: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-02-10',
  }
];

export const mockVideoLessons: VideoLesson[] = [
  // Resenha do dia
  {
    id: '1',
    title: 'Resenha do Dia: Treino Completo',
    description: 'Treino completo para melhorar suas habilidades no futebol.',
    videoUrl: 'https://www.youtube.com/watch?v=T0SMoG9MqMY',
    thumbnailUrl: 'https://img.youtube.com/vi/T0SMoG9MqMY/maxresdefault.jpg',
    module: 'technique',
    topic: 'Treino Completo',
    duration: 15,
    createdAt: '2024-03-19',
  },
  // Técnicas
  {
    id: '2',
    title: 'Técnicas Avançadas de Futebol',
    description: 'Aprenda técnicas avançadas para melhorar seu jogo.',
    videoUrl: 'https://www.youtube.com/watch?v=R1dsDM0pNL8',
    thumbnailUrl: 'https://img.youtube.com/vi/R1dsDM0pNL8/maxresdefault.jpg',
    module: 'technique',
    topic: 'Técnicas Avançadas',
    duration: 12,
    createdAt: '2024-03-18',
  },
  // Saúde
  {
    id: '3',
    title: 'Saúde no Futebol',
    description: 'Dicas importantes sobre saúde e bem-estar para jogadores.',
    videoUrl: 'https://www.youtube.com/watch?v=Kyh9K3t9qyU',
    thumbnailUrl: 'https://img.youtube.com/vi/Kyh9K3t9qyU/maxresdefault.jpg',
    module: 'health',
    topic: 'Saúde e Bem-estar',
    duration: 20,
    createdAt: '2024-03-17',
  },
  // Táticas
  {
    id: '4',
    title: 'Táticas de Jogo',
    description: 'Aprenda táticas essenciais para melhorar seu desempenho em campo.',
    videoUrl: 'https://www.youtube.com/watch?v=5jyu8Vi5bF8',
    thumbnailUrl: 'https://img.youtube.com/vi/5jyu8Vi5bF8/maxresdefault.jpg',
    module: 'tactics',
    topic: 'Táticas Básicas',
    duration: 18,
    createdAt: '2024-03-16',
  },
  // Cidadania
  {
    id: '5',
    title: 'Cidadania no Esporte',
    description: 'A importância da cidadania e valores no futebol.',
    videoUrl: 'https://www.youtube.com/watch?v=HPAle_k9MY4',
    thumbnailUrl: 'https://img.youtube.com/vi/HPAle_k9MY4/maxresdefault.jpg',
    module: 'citizenship',
    topic: 'Valores no Esporte',
    duration: 15,
    createdAt: '2024-03-15',
  }
];

export const mockUserVideos: UserVideo[] = [
  {
    id: '1',
    userId: '1',
    title: 'Treino de Finalização',
    description: 'Minha rotina de treino para melhorar a finalização.',
    videoUrl: 'https://example.com/user-videos/finishing-drill',
    thumbnailUrl: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-04-05',
    ratings: [
      { id: '1', userId: '2', videoId: '1', rating: 5, createdAt: '2023-04-06' },
      { id: '2', userId: '3', videoId: '1', rating: 4, createdAt: '2023-04-07' },
    ],
    averageRating: 4.5,
  },
  {
    id: '2',
    userId: '2',
    title: 'Dribles e Fintas',
    description: 'Demonstração de técnicas de drible que uso nos jogos.',
    videoUrl: 'https://example.com/user-videos/dribbling',
    thumbnailUrl: 'https://images.pexels.com/photos/8224167/pexels-photo-8224167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-04-10',
    ratings: [
      { id: '3', userId: '1', videoId: '2', rating: 5, createdAt: '2023-04-11' },
    ],
    averageRating: 5,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bola Oficial Jogo Lindo',
    description: 'Bola oficial de treinamento da escola Jogo Lindo.',
    price: 149.99,
    imageUrl: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Equipamentos',
    inStock: true,
  },
  {
    id: '2',
    name: 'Camisa de Treino',
    description: 'Camisa oficial para treinos com tecnologia de respiração.',
    price: 89.99,
    imageUrl: 'https://images.pexels.com/photos/6767873/pexels-photo-6767873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Vestuário',
    inStock: true,
  },
  {
    id: '3',
    name: 'Chuteira Profissional',
    description: 'Chuteira para campos de grama natural com travas de alumínio.',
    price: 299.99,
    imageUrl: 'https://images.pexels.com/photos/8224218/pexels-photo-8224218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Calçados',
    inStock: false,
  },
];

export const mockTryouts: TryoutEvent[] = [
  {
    id: '1',
    title: 'Peneira FC São Paulo',
    description: 'Seletiva para categorias de base do São Paulo FC.',
    date: '2023-07-15',
    location: 'CT Barra Funda',
    city: 'São Paulo',
    country: 'Brasil',
    ageRange: '12-15 anos',
    organizerName: 'São Paulo FC',
    contactInfo: 'peneira@spfc.com.br',
  },
  {
    id: '2',
    title: 'Seletiva Flamengo',
    description: 'Avaliação técnica para jovens talentos no Rio de Janeiro.',
    date: '2023-07-22',
    location: 'Ninho do Urubu',
    city: 'Rio de Janeiro',
    country: 'Brasil',
    ageRange: '16-18 anos',
    organizerName: 'Flamengo',
    contactInfo: 'base@flamengo.com.br',
  },
  {
    id: '3',
    title: 'Captação Internacional',
    description: 'Oportunidade para jovens brasileiros jogarem na Europa.',
    date: '2023-08-05',
    location: 'Estádio Municipal',
    city: 'Belo Horizonte',
    country: 'Brasil',
    ageRange: '17-20 anos',
    organizerName: 'European Scout Agency',
    contactInfo: 'contact@escout.com',
  },
];