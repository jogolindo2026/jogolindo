import { useState, useMemo } from 'react';
import { Trophy, Target, Hand, Users, TrendingUp, Medal } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Tab = 'presencas' | 'vitorias' | 'gols' | 'assistencias' | 'aproveitamento';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'presencas', label: 'Presenças', icon: <Users size={16} /> },
  { key: 'vitorias', label: 'Vitórias', icon: <Trophy size={16} /> },
  { key: 'gols', label: 'Gols', icon: <Target size={16} /> },
  { key: 'assistencias', label: 'Assistências', icon: <Hand size={16} /> },
  { key: 'aproveitamento', label: 'Aproveitamento', icon: <TrendingUp size={16} /> },
];

export function RankingPage() {
  const { data } = useData();
  const [tab, setTab] = useState<Tab>('gols');

  const ranked = useMemo(() => {
    const members = [...data.members];
    switch (tab) {
      case 'presencas': return members.sort((a, b) => b.presentCount - a.presentCount);
      case 'vitorias': return members.sort((a, b) => b.wins - a.wins);
      case 'gols': return members.sort((a, b) => b.goals - a.goals);
      case 'assistencias': return members.sort((a, b) => b.assists - a.assists);
      case 'aproveitamento': return members.filter((m) => m.gamesPlayed >= 5).sort((a, b) => {
        const ar = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
        const br = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
        return br - ar;
      });
    }
  }, [data.members, tab]);

  const getValue = (m: typeof ranked[0]): number => {
    switch (tab) {
      case 'presencas': return m.presentCount;
      case 'vitorias': return m.wins;
      case 'gols': return m.goals;
      case 'assistencias': return m.assists;
      case 'aproveitamento': return m.gamesPlayed > 0 ? Math.round((m.wins / m.gamesPlayed) * 100) : 0;
    }
  };

  const maxValue = ranked.length > 0 ? getValue(ranked[0]) : 1;
  const craque = [...data.members].sort((a, b) => (b.goals * 2 + b.assists) - (a.goals * 2 + a.assists))[0];

  const medalColors = ['bg-yellow-400 text-yellow-900', 'bg-gray-300 text-gray-700', 'bg-orange-400 text-orange-900'];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Ranking</h1>

      {/* Craque da rodada */}
      <Card className="p-5 bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Medal size={32} className="text-yellow-300" />
          </div>
          <div>
            <p className="text-green-100 text-sm">Craque da rodada</p>
            <p className="text-2xl font-bold">{craque?.name}</p>
            <p className="text-green-100 text-sm">{craque?.goals} gols, {craque?.assists} assistências</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Ranking list */}
      <div className="space-y-2">
        {ranked.slice(0, 15).map((m, i) => (
          <Card key={m.id} className="p-3">
            <div className="flex items-center gap-3">
              {i < 3 ? (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${medalColors[i]}`}>
                  {i + 1}
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 text-sm">
                  {i + 1}
                </div>
              )}
              <Avatar name={m.name} size="md" src={m.avatar} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-500">{m.position} - {m.gamesPlayed} jogos</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{getValue(m)}{tab === 'aproveitamento' ? '%' : ''}</p>
              </div>
            </div>
            <div className="mt-2">
              <ProgressBar value={getValue(m)} max={maxValue || 1} color={i === 0 ? 'green' : i === 1 ? 'blue' : 'orange'} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
