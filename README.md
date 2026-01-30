# Gold Price Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

Ứng dụng theo dõi giá vàng real-time với Next.js 16 và React 19.

## ✨ Features

- 📊 **Real-time Price Updates** - Cập nhật giá vàng tức thì qua WebSocket
- 📈 **Interactive Charts** - Biểu đồ lịch sử giá với zoom, brush và export
- 🔍 **Price Comparison** - So sánh giá giữa các loại vàng
- 📱 **Responsive Design** - Tương thích mọi thiết bị
- 🌙 **Dark Mode** - Hỗ trợ theme sáng/tối
- 🔐 **Authentication** - Đăng nhập để xem lịch sử chi tiết
- 🔔 **Notifications** - Thông báo khi giá thay đổi
- 🚀 **SEO Optimized** - Metadata, sitemap, structured data

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + Shadcn/ui |
| State Management | Zustand 5 |
| Server State | TanStack Query 5 |
| Real-time | Socket.IO Client |
| Charts | Recharts 3 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | Sonner |

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/             # Protected routes
│   ├── (public)/           # Public routes
│   └── auth/               # Auth pages
├── components/             # React Components
│   ├── auth/               # Authentication
│   ├── prices/             # Price display
│   ├── realtime/           # Connection status
│   ├── theme/              # Theme toggle
│   └── ui/                 # Shadcn/ui components
├── lib/                    # Utilities & Logic
│   ├── api/                # API layer
│   ├── hooks/              # Custom hooks
│   ├── store/              # Zustand stores
│   └── utils/              # Helper functions
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x hoặc cao hơn
- npm, yarn, hoặc pnpm
- Backend API đang chạy

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-org/gold-price-frontend.git
   cd gold-price-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env.local
   ```

   Cập nhật các biến môi trường:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/v1
   NEXT_PUBLIC_WS_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Mở [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm run start
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3001) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔌 API Integration

### REST API

```typescript
// lib/api/axios.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

**Endpoints:**
- `GET /prices` - Lấy tất cả giá hiện tại
- `GET /prices/:code/history` - Lịch sử giá theo mã
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/me` - Thông tin user hiện tại

### WebSocket Events

```typescript
// Subscribe
socket.on('prices:current', (data) => { ... });
socket.on('prices:updated', (data) => { ... });
socket.on('price:changed', (data) => { ... });

// Emit
socket.emit('subscribe:gold', ['SJC', 'PNJ']);
socket.emit('request:prices');
```

## 🎨 Components

### Price Components

| Component | Description |
|-----------|-------------|
| `PriceTable` | Bảng giá vàng với sorting |
| `PriceCard` | Card hiển thị giá đơn lẻ |
| `PriceGrid` | Grid layout cho nhiều cards |
| `PriceHistoryChart` | Biểu đồ lịch sử với zoom |
| `PriceHistoryTable` | Bảng lịch sử chi tiết |
| `WorldGoldPrice` | Giá vàng thế giới |
| `TopMovers` | Top biến động trong ngày |

### UI Components (Shadcn/ui)

Button, Card, Dialog, Dropdown, Input, Select, Skeleton, Table, Tabs, và nhiều hơn nữa.

## 🔐 Authentication

Hệ thống sử dụng JWT với access/refresh tokens:

```typescript
// Login
await authStore.login(email, password);

// Check auth status
const { isAuthenticated, user } = useAuthStore();

// Protected routes
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

## 🌐 SEO

- **Metadata API** - Dynamic titles, descriptions
- **Structured Data** - Organization, WebSite schemas
- **Sitemap** - Auto-generated tại `/sitemap.xml`
- **Open Graph** - Social sharing optimization

## 🎯 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/v1` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3001` |

## 📖 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc chi tiết
- [CONTRIBUTING.md](CONTRIBUTING.md) - Hướng dẫn đóng góp

## 🤝 Contributing

Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết cách đóng góp.

## 📄 License

Dự án được phát hành dưới [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

Made with ❤️ by Gold Price Team
