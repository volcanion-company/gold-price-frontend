'use client';

import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('container mx-auto px-3 py-4 md:px-4 md:py-6 max-w-4xl', className)}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6', className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageSection({ children, title, description, actions, className }: PageSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
