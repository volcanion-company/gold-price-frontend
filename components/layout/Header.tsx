'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConnectionStatus } from '@/components/realtime/ConnectionStatus';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { Coins, History, User, LogOut, Menu, X, BarChart3, Home } from 'lucide-react';

export function Header() {
  const t = useTranslations();
  const { isAuthenticated, user, logout } = useAuth();
  const { connected } = useWebSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/' as const, label: t('nav.home'), icon: Home },
    { href: '/compare' as const, label: t('nav.compare'), icon: BarChart3 },
    ...(isAuthenticated ? [
      { href: '/history' as const, label: t('nav.history'), icon: History },
      { href: '/profile' as const, label: t('nav.account'), icon: User },
    ] : []),
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                {t('common.appName')}
              </h1>
              <p className="text-xs text-muted-foreground">{t('common.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Public links */}
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/compare"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t('nav.compare')}
            </Link>

            {/* Theme toggle + Language (no padding) */}
            <LanguageSwitcher compact />
            <div data-onboarding="theme-toggle">
              <ThemeToggle compact />
            </div>

            {/* Auth-dependent links - far right */}
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <ConnectionStatus connected={connected} />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/history" className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        {t('nav.history')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.account')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ConnectionStatus connected={connected} />
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  <Link href="/auth/register">{t('nav.register')}</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-1 md:hidden">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t('nav.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
                      <Coins className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                      {t('common.appName')}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-muted-foreground" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="flex-1" onClick={closeMobileMenu}>
                        <Link href="/auth/login">{t('nav.login')}</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                        onClick={closeMobileMenu}
                      >
                        <Link href="/auth/register">{t('nav.register')}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
