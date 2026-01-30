# Contributing

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Gold Price Frontend! Tài liệu này hướng dẫn quy trình và quy tắc để contribute.

## Mục lục

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

- Tôn trọng mọi người tham gia dự án
- Xây dựng môi trường làm việc tích cực
- Chấp nhận phản hồi mang tính xây dựng
- Tập trung vào điều tốt nhất cho cộng đồng

## Getting Started

### Prerequisites

- Node.js 18.x trở lên
- npm hoặc yarn hoặc pnpm
- Git

### Setup

1. **Fork repository**

2. **Clone repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gold-price-frontend.git
   cd gold-price-frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Tạo file environment:**
   ```bash
   cp .env.example .env.local
   ```

5. **Chạy development server:**
   ```bash
   npm run dev
   ```

   Ứng dụng sẽ chạy tại `http://localhost:3001`

## Development Workflow

### Branches

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

### Workflow

1. Tạo branch từ `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Develop và commit changes

3. Push branch và tạo Pull Request vào `develop`

## Coding Standards

### TypeScript

- Sử dụng TypeScript cho tất cả files
- Định nghĩa types rõ ràng, tránh `any`
- Export types từ `types/index.ts`

```typescript
// ✅ Good
interface PriceCardProps {
  price: Price;
  showChange?: boolean;
}

// ❌ Bad
const PriceCard = (props: any) => { ... }
```

### React Components

- Sử dụng functional components
- Đặt `'use client'` directive khi cần client-side features
- Destructure props

```tsx
// ✅ Good
'use client';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn('btn', variant)}>
      {label}
    </button>
  );
}
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PriceCard.tsx` |
| Hooks | camelCase với prefix `use` | `useWebSocket.ts` |
| Utilities | camelCase | `formatters.ts` |
| Types | PascalCase | `index.ts` (export interfaces) |
| Stores | camelCase với suffix `Store` | `pricesStore.ts` |

### Import Order

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { format } from 'date-fns';
import { toast } from 'sonner';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { PriceCard } from '@/components/prices/PriceCard';

// 4. Hooks và stores
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { usePricesStore } from '@/lib/store/pricesStore';

// 5. Types
import { Price } from '@/types';

// 6. Utils
import { formatPrice } from '@/lib/utils/formatters';
```

### Styling

- Sử dụng Tailwind CSS
- Sử dụng `cn()` utility để merge classes
- Tránh inline styles

```tsx
// ✅ Good
<div className={cn(
  'flex items-center gap-2',
  isActive && 'bg-primary text-primary-foreground',
  className
)}>

// ❌ Bad
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### State Management

**Zustand (Global State):**
```typescript
// lib/store/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  data: string[];
  addItem: (item: string) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  data: [],
  addItem: (item) => set((state) => ({ data: [...state.data, item] })),
}));
```

**TanStack Query (Server State):**
```typescript
// Cho API calls cần caching
import { useQuery } from '@tanstack/react-query';

export function usePriceHistory(code: string) {
  return useQuery({
    queryKey: ['priceHistory', code],
    queryFn: () => fetchPriceHistory(code),
  });
}
```

## Commit Guidelines

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no new feature or fix |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Build process, dependencies |

### Examples

```bash
feat(prices): add price comparison chart

fix(auth): resolve token refresh loop

docs(readme): update installation instructions

refactor(hooks): simplify useWebSocket logic
```

## Pull Request Process

### Before Creating PR

1. ✅ Code builds without errors: `npm run build`
2. ✅ Linting passes: `npm run lint`
3. ✅ Types are correct: `npx tsc --noEmit`
4. ✅ Tested locally

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Testing
How did you test these changes?

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Added comments for complex logic
- [ ] Updated documentation if needed
```

### Review Process

1. PR được tạo và request review
2. Reviewer check code và để comments
3. Author address feedback
4. Approval và merge

## Project Structure

### Adding a New Feature

1. **Component:**
   ```
   components/
   └── feature-name/
       ├── FeatureComponent.tsx
       └── FeatureHelper.tsx
   ```

2. **Hook (if needed):**
   ```
   lib/hooks/useFeature.ts
   ```

3. **Store (if needed):**
   ```
   lib/store/featureStore.ts
   ```

4. **Types:**
   ```typescript
   // types/index.ts
   export interface FeatureData {
     // ...
   }
   ```

5. **Page:**
   ```
   app/(public)/feature/
   ├── layout.tsx
   └── page.tsx
   ```

### Adding a New UI Component

Base UI components nên được thêm vào `components/ui/`:

```bash
npx shadcn@latest add [component-name]
```

Hoặc tạo manual với cấu trúc:

```tsx
// components/ui/new-component.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface NewComponentProps {
  // props
}

export function NewComponent({ className, ...props }: NewComponentProps) {
  return (
    <div className={cn('base-styles', className)} {...props} />
  );
}
```

## Questions?

Nếu có câu hỏi, hãy tạo issue với label `question` hoặc liên hệ team.

---

Happy Contributing! 🎉
