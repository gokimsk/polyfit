import { Skeleton } from './ui/skeleton';
import { AlertCircle, Search } from 'lucide-react';
import { Button } from './ui/button';

export function PolicyCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <div className="space-y-3">
        <div>
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PolicyListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <PolicyCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function EmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        검색 결과가 없어요
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        선택하신 상황에 맞는 정책이 없습니다.
        다른 상황을 선택해보시거나 나중에 다시 확인해주세요.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          다시 시도하기
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        네트워크 오류가 발생했어요
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        인터넷 연결을 확인하고 다시 시도해주세요.
        문제가 계속되면 잠시 후 다시 접속해주세요.
      </p>
      <Button onClick={onRetry}>
        새로고침
      </Button>
    </div>
  );
}