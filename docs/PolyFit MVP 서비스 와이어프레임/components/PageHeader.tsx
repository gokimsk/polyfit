import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  showShare?: boolean;
  onShare?: () => void;
}

export function PageHeader({ title, onBack, showShare, onShare }: PageHeaderProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2 h-auto"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="font-medium text-gray-900">{title}</h1>
        </div>
        
        {showShare && onShare && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShare}
            className="p-2 h-auto"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}