'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { PageShell, PageHeader } from '@/components/layout/PageShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { User, Lock, Calendar, Mail, Save, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations();
  const { user, isLoading } = useAuth();
  const { updateProfile, changePassword } = useAuthStore();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update name when user loads
  useState(() => {
    if (user?.name) {
      setName(user.name);
    }
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error(t('profile.validation.nameRequired'));
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success(t('profile.updateSuccess'));
    } catch (error: any) {
      toast.error(error.message || t('profile.updateFailed'));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error(t('profile.validation.currentPasswordRequired'));
      return;
    }

    if (!newPassword) {
      toast.error(t('profile.validation.newPasswordRequired'));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('profile.validation.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('profile.validation.passwordMismatch'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success(t('profile.passwordChanged'));
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || t('profile.passwordChangeFailed'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          title={t('profile.title')}
          description={t('profile.description')}
        />

        {/* Profile Overview Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-3xl">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('profile.memberSince')}: {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profile.personalInfo')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t('profile.security')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.editProfile')}</CardTitle>
                <CardDescription>{t('profile.editProfileDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('profile.name')}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('profile.namePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('profile.emailCannotChange')}
                    </p>
                  </div>
                  <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto">
                    {isUpdatingProfile ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('profile.updateProfile')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.changePassword')}</CardTitle>
                <CardDescription>{t('profile.changePasswordDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('profile.passwordHint')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto">
                    {isChangingPassword ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {t('profile.changePassword')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
