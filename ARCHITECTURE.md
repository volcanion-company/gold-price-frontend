# Architecture

Tài liệu này mô tả kiến trúc và tổ chức source code của Gold Price Frontend.

## Tổng quan

Gold Price Frontend là ứng dụng Next.js 16 được xây dựng với React 19, sử dụng App Router và các công nghệ hiện đại để theo dõi giá vàng real-time.

## Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Next.js | 16.1.6 | React Framework với App Router |
| React | 19.2.3 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Zustand | 5.x | State Management |
| TanStack Query | 5.x | Server State & Caching |
| Socket.IO Client | 4.x | WebSocket Real-time |
| Recharts | 3.x | Data Visualization |
| Radix UI | Latest | Headless UI Components |
| Axios | 1.x | HTTP Client |

## Cấu trúc thư mục

```
gold-price-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── (auth)/             # Route group - protected routes
│   │   ├── layout.tsx      # Auth layout với AuthGuard
│   │   └── history/        # Trang lịch sử giá (yêu cầu đăng nhập)
│   ├── (public)/           # Route group - public routes
│   │   ├── layout.tsx      # Public layout
│   │   ├── page.tsx        # Trang chủ
│   │   └── compare/        # Trang so sánh giá
│   └── auth/               # Auth pages (không dùng route group)
│       ├── login/          # Đăng nhập
│       └── register/       # Đăng ký
├── components/             # React Components
│   ├── auth/               # Authentication components
│   ├── errors/             # Error handling
│   ├── layout/             # Layout components
│   ├── onboarding/         # User onboarding
│   ├── prices/             # Price display components
│   ├── realtime/           # Real-time connection status
│   ├── seo/                # SEO & Structured Data
│   ├── theme/              # Theme toggle & provider
│   └── ui/                 # Shadcn/ui base components
├── lib/                    # Utilities & Business Logic
│   ├── utils.ts            # Common utilities (cn, etc.)
│   ├── api/                # API layer
│   │   ├── axios.ts        # Axios instance với interceptors
│   │   └── websocket.ts    # Socket.IO initialization
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── usePriceHistory.ts # Price history với TanStack Query
│   │   └── useWebSocket.ts # WebSocket connection hook
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts    # Auth state management
│   │   └── pricesStore.ts  # Prices state management
│   └── utils/              # Utility functions
│       └── formatters.ts   # Price & date formatters
├── types/                  # TypeScript type definitions
│   └── index.ts            # Shared types
└── public/                 # Static assets
    └── robots.txt          # SEO robots file
```

## Patterns & Conventions

### 1. Route Groups

Sử dụng Route Groups của Next.js để tổ chức routes:

- `(public)` - Routes công khai, không yêu cầu đăng nhập
- `(auth)` - Routes được bảo vệ, yêu cầu authentication
- `auth/` - Các trang authentication (login, register)

### 2. State Management

**Global State (Zustand):**
- `pricesStore` - Quản lý giá vàng real-time
- `authStore` - Quản lý authentication state

**Server State (TanStack Query):**
- Sử dụng cho price history API calls
- Auto caching và background refetching

### 3. Real-time Data Flow

```
Backend WebSocket Server
         │
         ▼
    websocket.ts (Socket.IO Client)
         │
         ▼
    useWebSocket.ts (Custom Hook)
         │
         ▼
    pricesStore.ts (Zustand Store)
         │
         ▼
    UI Components (PriceTable, PriceCard, etc.)
```

### 4. Authentication Flow

```
User Action
     │
     ▼
authStore.login() / register()
     │
     ▼
API Call (/auth/login, /auth/register)
     │
     ▼
Store tokens in localStorage
     │
     ▼
Update Zustand state
     │
     ▼
Redirect to intended page
```

**Token Refresh:**
- Axios interceptor tự động refresh token khi nhận 401
- Queue các requests đang pending trong quá trình refresh

### 5. Component Organization

**UI Components (`components/ui/`):**
- Base components từ Shadcn/ui
- Không chứa business logic
- Highly reusable

**Feature Components (`components/*/`):**
- Grouped by feature domain
- May contain business logic
- Use hooks và stores

### 6. API Layer

**Axios Instance (`lib/api/axios.ts`):**
- Base URL configuration
- Request interceptor: Thêm Authorization header
- Response interceptor: Auto refresh token

**WebSocket (`lib/api/websocket.ts`):**
- Singleton pattern
- Auto reconnection
- Event-based communication

## Data Types

### Core Types

```typescript
interface Price {
  _id: string;
  code: string;           // Mã vàng (SJC, PNJ, etc.)
  name: string;           // Tên hiển thị
  buy: number;            // Giá mua
  sell: number;           // Giá bán
  changeBuy: number;      // Thay đổi giá mua
  changeSell: number;     // Thay đổi giá bán
  currency: 'VND' | 'USD';
  source: string;         // Nguồn dữ liệu
  updatedAt: string;
}

interface PriceHistory {
  _id: string;
  code: string;
  buy: number;
  sell: number;
  changeBuy: number;
  changeSell: number;
  currency: 'VND' | 'USD';
  recordedAt: string;
  period: 'minute' | 'hour' | 'day';
}

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

## Performance Optimizations

1. **React 19 Features:** Sử dụng concurrent features
2. **Code Splitting:** Automatic với Next.js App Router
3. **Image Optimization:** Next.js Image component
4. **Font Optimization:** next/font với Geist fonts
5. **Bundle Optimization:** Tree shaking với ES modules

## SEO

- Dynamic metadata với Next.js Metadata API
- Structured Data (JSON-LD) cho Organization và Website
- Dynamic sitemap generation
- Open Graph và Twitter Cards

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Future Considerations

- Server Components cho static content
- Streaming SSR cho dynamic data
- Edge Runtime cho API routes
- PWA support với next-pwa
