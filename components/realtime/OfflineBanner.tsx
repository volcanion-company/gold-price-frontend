'use client';

import { useTranslations } from 'next-intl';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfflineBannerProps {
  isConnected: boolean;
  onReconnect?: () => void;
  lastUpdated?: Date | string | null;
}

export function OfflineBanner({ isConnected, onReconnect, lastUpdated }: OfflineBannerProps) {
  const t = useTranslations('connection');

  if (isConnected) return null;

  const formatLastUpdated = () => {
    if (!lastUpdated) return null;
    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffMin < 1) return t('justNow');
    if (diffMin < 60) return `${diffMin} ${t('minutesAgo')}`;
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <WifiOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              {t('lostConnection')}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('dataNotLatest')}
              {lastUpdated && (
                <span className="ml-1">• {t('lastUpdated')}: {formatLastUpdated()}</span>
              )}
            </p>
          </div>
        </div>
        {onReconnect && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReconnect}
            className="flex-shrink-0 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('reconnect')}
          </Button>
        )}
      </div>
    </div>
  );
}
