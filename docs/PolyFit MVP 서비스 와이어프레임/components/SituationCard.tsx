import { Check } from 'lucide-react';

interface SituationCardProps {
  id: string;
  title: string;
  emoji: string;
  color: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  disabled?: boolean;
}

const colorClasses = {
  blue: 'border-blue-500 bg-blue-50 text-blue-700',
  green: 'border-green-500 bg-green-50 text-green-700', 
  orange: 'border-orange-500 bg-orange-50 text-orange-700',
  pink: 'border-pink-500 bg-pink-50 text-pink-700',
  purple: 'border-purple-500 bg-purple-50 text-purple-700',
  red: 'border-red-500 bg-red-50 text-red-700'
};

export function SituationCard({ id, title, emoji, color, isSelected, onClick, disabled }: SituationCardProps) {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? colorClasses[color as keyof typeof colorClasses]
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onClick(id)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-current rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="text-2xl">{emoji}</div>
        <h3 className={`font-medium ${isSelected ? 'text-current' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>
    </div>
  );
}