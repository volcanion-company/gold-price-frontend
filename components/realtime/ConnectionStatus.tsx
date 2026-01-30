'use client';

import { useTranslations } from 'next-intl';
import { Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  const t = useTranslations('connection');

  return (
    <Badge variant={connected ? 'default' : 'secondary'} className="gap-2">
      <Circle
        className={`h-2 w-2 ${
          connected
            ? 'fill-green-500 text-green-500 animate-pulse'
            : 'fill-gray-400 text-gray-400'
        }`}
      />
      <span className="text-xs">
        {connected ? t('connected') : t('disconnected')}
      </span>
    </Badge>
  );
}
