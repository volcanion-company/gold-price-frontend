'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Lock, TrendingUp, FileBarChart, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HistoryLoginPrompt() {
  const t = useTranslations('history.loginPrompt');
  const tNav = useTranslations('nav');

  return (
    <Card className="border-2 border-dashed border-primary/50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
          <Lock className="relative h-16 w-16 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-3 text-center">
          {t('title')}
        </h2>
        
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {t('description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">{t('feature1.title')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('feature1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <FileBarChart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">{t('feature2.title')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('feature2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Download className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">{t('feature3.title')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('feature3.description')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="min-w-[140px]">
            <Link href="/auth/login">{tNav('login')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[140px]">
            <Link href="/auth/register">{t('registerFree')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
