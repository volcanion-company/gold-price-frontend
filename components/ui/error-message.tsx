import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  message = 'Đã xảy ra lỗi. Vui lòng thử lại.',
  onRetry,
  className 
}: ErrorMessageProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 p-6 rounded-lg border border-destructive/50 bg-destructive/5',
      className
    )}>
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-lg">Lỗi tải dữ liệu</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Thử lại
        </Button>
      )}
    </div>
  );
}
