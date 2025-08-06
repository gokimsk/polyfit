import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Calendar, Building2 } from 'lucide-react';

interface PolicyCardProps {
  id: string;
  title: string;
  target: string;
  support: string;
  period: string;
  deadline: string;
  matchReason: string;
  matchScore: number;
  source: string;
  onClick: (id: string) => void;
}

export function PolicyCard({ 
  id, 
  title, 
  target, 
  support, 
  period, 
  deadline, 
  matchReason, 
  matchScore,
  source, 
  onClick 
}: PolicyCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => onClick(id)}
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-1">{target} · {support}</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{period}</span>
          <span className="text-red-500">~{deadline}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {matchReason}
            </Badge>
            <span className="text-xs text-green-600 font-medium">
              {matchScore}% 일치
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Building2 className="w-3 h-3" />
            <span>{source}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}