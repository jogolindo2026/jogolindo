import { RankingPlayer, PlayerStats, AgeCategory, Gender } from '../types';

// Generate realistic player photos from Pexels
const malePlayerPhotos = [
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
];

const femalePlayerPhotos = [
  'https://images.pexels.com/photos/3621121/pexels-photo-3621121.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
];

const brazilianClubs = [
  'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Santos', 'Grêmio',
  'Internacional', 'Atlético-MG', 'Cruzeiro', 'Botafogo', 'Vasco', 'Fluminense',
  'Bahia', 'Sport', 'Ceará', 'Fortaleza', 'Athletico-PR', 'Coritiba'
];

const internationalClubs = [
  'Barcelona', 'Real Madrid', 'Manchester United', 'Liverpool', 'Chelsea',
  'Arsenal', 'Manchester City', 'PSG', 'Bayern Munich', 'Juventus', 'AC Milan',
  'Inter Milan', 'Atletico Madrid', 'Borussia Dortmund', 'Ajax'
];

const agents = [
  'Carlos Silva Sports', 'Brazilian Talents Agency', 'Global Football Management',
  'Elite Player Representation', 'South American Soccer Agency', 'Pro Athletes Brazil',
  'International Football Partners', 'Premier Sports Management'
];

const maleNames = [
  'Gabriel Silva', 'Lucas Santos', 'Rafael Oliveira', 'Matheus Costa', 'João Pedro',
  'Felipe Rodrigues', 'Bruno Almeida', 'Diego Ferreira', 'Thiago Martins', 'André Lima',
  'Vinicius Souza', 'Gustavo Pereira', 'Leonardo Barbosa', 'Rodrigo Carvalho', 'Pedro Henrique',
  'Caio Ribeiro', 'Enzo Gomes', 'Arthur Nascimento', 'Davi Rocha', 'Miguel Torres'
];

const femaleNames = [
  'Ana Silva', 'Beatriz Santos', 'Camila Oliveira', 'Daniela Costa', 'Eduarda Lima',
  'Fernanda Rodrigues', 'Gabriela Almeida', 'Helena Ferreira', 'Isabela Martins', 'Julia Souza',
  'Larissa Pereira', 'Mariana Barbosa', 'Natália Carvalho', 'Olivia Ribeiro', 'Paula Gomes',
  'Rafaela Nascimento', 'Sofia Rocha', 'Valentina Torres', 'Yasmin Cruz', 'Vitória Dias'
];

const cities = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília',
  'Fortaleza', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Goiânia',
  'Belém', 'Guarulhos', 'Campinas', 'São Luís', 'Maceió', 'Natal', 'João Pessoa'
];

function generateRandomStats(position: string, isGoalkeeper: boolean = false): PlayerStats {
  const baseStats = {
    passing: Math.floor(Math.random() * 3) + 3, // 3-5
    shooting: isGoalkeeper ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3,
    dribbling: isGoalkeeper ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 3,
    speed: Math.floor(Math.random() * 3) + 3,
    strength: Math.floor(Math.random() * 3) + 3,
    jumping: Math.floor(Math.random() * 3) + 3,
    goals: isGoalkeeper ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 25) + 5,
    assists: Math.floor(Math.random() * 15) + 2,
    matchesPlayed: Math.floor(Math.random() * 50) + 20,
    clubs: [],
    overallRating: 0
  };

  // Add penalty saves for goalkeepers
  if (isGoalkeeper) {
    baseStats.penaltySaves = Math.floor(Math.random() * 10) + 3;
  }

  // Generate club history (1-3 clubs)
  const numClubs = Math.floor(Math.random() * 3) + 1;
  const availableClubs = [...brazilianClubs, ...internationalClubs];
  for (let i = 0; i < numClubs; i++) {
    const randomClub = availableClubs[Math.floor(Math.random() * availableClubs.length)];
    if (!baseStats.clubs.includes(randomClub)) {
      baseStats.clubs.push(randomClub);
    }
  }

  // Add agent (70% chance)
  if (Math.random() > 0.3) {
    baseStats.agent = agents[Math.floor(Math.random() * agents.length)];
  }

  // Calculate overall rating
  const skillAverage = (baseStats.passing + baseStats.shooting + baseStats.dribbling + 
                       baseStats.speed + baseStats.strength + baseStats.jumping) / 6;
  baseStats.overallRating = Math.round(skillAverage * 20); // Convert to 0-100 scale

  return baseStats;
}

function generatePlayer(
  id: string, 
  name: string, 
  age: number, 
  gender: Gender, 
  photo: string,
  position: string
): RankingPlayer {
  const isGoalkeeper = position === 'goalkeeper';
  const birthYear = new Date().getFullYear() - age;
  const birthDate = `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
  
  return {
    id,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    name,
    role: 'player',
    gender,
    birthDate,
    country: 'Brasil',
    city: cities[Math.floor(Math.random() * cities.length)],
    position: position as any,
    height: Math.floor(Math.random() * 25) + 165, // 165-190cm
    weight: Math.floor(Math.random() * 25) + 60,  // 60-85kg
    profilePicture: photo,
    createdAt: new Date().toISOString(),
    stats: generateRandomStats(position, isGoalkeeper),
    age
  };
}

export function generateRankingData(): RankingPlayer[] {
  const players: RankingPlayer[] = [];
  let playerId = 1;

  const positions = ['goalkeeper', 'defender', 'midfielder', 'forward'];
  
  // Generate male players
  maleNames.forEach((name, index) => {
    if (index < 15) { // Limit to 15 male players
      const age = Math.floor(Math.random() * 10) + 16; // 16-25 years
      const position = positions[Math.floor(Math.random() * positions.length)];
      const photo = malePlayerPhotos[index % malePlayerPhotos.length];
      
      players.push(generatePlayer(
        playerId.toString(),
        name,
        age,
        'male',
        photo,
        position
      ));
      playerId++;
    }
  });

  // Generate female players
  femaleNames.forEach((name, index) => {
    if (index < 15) { // Limit to 15 female players
      const age = Math.floor(Math.random() * 10) + 16; // 16-25 years
      const position = positions[Math.floor(Math.random() * positions.length)];
      const photo = femalePlayerPhotos[index % femalePlayerPhotos.length];
      
      players.push(generatePlayer(
        playerId.toString(),
        name,
        age,
        'female',
        photo,
        position
      ));
      playerId++;
    }
  });

  // Sort by overall rating
  return players.sort((a, b) => b.stats.overallRating - a.stats.overallRating);
}

export function categorizePlayersByAge(players: RankingPlayer[]): { [key: string]: RankingPlayer[] } {
  return players.reduce((categories, player) => {
    let category: string;
    
    if (player.age <= 15) {
      category = 'sub-15';
    } else if (player.age <= 17) {
      category = 'sub-17';
    } else if (player.age <= 20) {
      category = 'sub-20';
    } else {
      category = 'profissional';
    }
    
    const key = `${player.gender}-${category}`;
    if (!categories[key]) {
      categories[key] = [];
    }
    categories[key].push(player);
    
    return categories;
  }, {} as { [key: string]: RankingPlayer[] });
}

export function getPositionLabel(position: string): string {
  const positions = {
    goalkeeper: 'Goleiro',
    defender: 'Defensor',
    midfielder: 'Meio-campo',
    forward: 'Atacante'
  };
  return positions[position as keyof typeof positions] || position;
}

export function getCategoryLabel(gender: Gender, ageCategory: AgeCategory): string {
  const genderLabel = gender === 'male' ? 'Masculino' : 'Feminino';
  const ageLabels = {
    'sub-15': 'Sub-15',
    'sub-17': 'Sub-17',
    'sub-20': 'Sub-20',
    'profissional': 'Profissional'
  };
  
  return `${genderLabel} ${ageLabels[ageCategory]}`;
}