'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Period } from '@/lib/hooks/usePriceHistory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type { Period };

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  className?: string;
}

const periodKeys: Period[] = ['7d', '30d', '90d', '1y', 'all'];

export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  const t = useTranslations('prices.period');

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-[130px]', className)}>
        <SelectValue placeholder={t('selectPeriod')} />
      </SelectTrigger>
      <SelectContent>
        {periodKeys.map((periodKey) => (
          <SelectItem key={periodKey} value={periodKey}>
            {t(periodKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
