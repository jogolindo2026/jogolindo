import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: 'green' | 'blue' | 'red' | 'yellow' | 'gray';
  subtitle?: string;
}

const accents: Record<string, string> = {
  green: 'text-green-600 bg-green-50',
  blue: 'text-blue-600 bg-blue-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50',
  gray: 'text-gray-600 bg-gray-100',
};

export function StatCard({ label, value, icon, accent = 'gray', subtitle }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl ${accents[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
