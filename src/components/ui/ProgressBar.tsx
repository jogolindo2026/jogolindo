interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'green' | 'blue' | 'orange' | 'red';
  label?: string;
  showValue?: boolean;
}

const colors = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

export function ProgressBar({ value, max, color = 'green', label, showValue }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium">{label}</span>
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
