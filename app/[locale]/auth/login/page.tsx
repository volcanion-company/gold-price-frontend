'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/store/authStore';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success(t('auth.login.success'));
    } catch (error: any) {
      toast.error(error.message || t('auth.login.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-lg">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{t('auth.login.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('auth.login.description')}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              disabled={loading}
            >
              {loading ? t('auth.login.loading') : t('auth.login.submit')}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
              <Link
                href="/auth/register"
                className="text-yellow-600 hover:underline font-medium"
              >
                {t('auth.login.registerNow')}
              </Link>
            </p>

            <Link
              href="/"
              className="text-sm text-center text-muted-foreground hover:text-primary block"
            >
              ← {t('auth.login.backToHome')}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
