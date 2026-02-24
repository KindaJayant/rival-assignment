# Secure Blog Platform

A production-ready blog platform with user authentication, private dashboards, public feeds, and social engagement features.

**Live:** [https://rival-assignment-h182.vercel.app](https://rival-assignment-h182.vercel.app)  
**API:** [https://rival-assignment.onrender.com/api](https://rival-assignment.onrender.com/api)  
**Repo:** [https://github.com/KindaJayant/rival-assignment](https://github.com/KindaJayant/rival-assignment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS (TypeScript, strict mode) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT (access + refresh tokens), bcrypt |
| Frontend | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, lucide-react icons |
| Deployment | Vercel (frontend), Render (backend), Neon (database) |

---

## Architecture

```
rival-assignment/
├── backend/                    # NestJS API server
│   ├── prisma/
│   │   └── schema.prisma       # Database schema (4 models, indexes, constraints)
│   └── src/
│       ├── auth/               # JWT auth system
│       │   ├── auth.service.ts         # Register, login, refresh, token generation
│       │   ├── auth.controller.ts      # /auth/* endpoints
│       │   ├── strategies/jwt.strategy.ts
│       │   ├── guards/jwt-auth.guard.ts
│       │   ├── decorators/current-user.decorator.ts
│       │   └── dto/                    # RegisterDto, LoginDto
│       ├── blog/               # Blog CRUD (owner-only mutations)
│       │   ├── blog.service.ts         # Create, update, delete with slug generation
│       │   ├── blog.controller.ts      # Protected /blogs/* endpoints
│       │   └── dto/                    # CreateBlogDto, UpdateBlogDto
│       ├── public/             # Public read-only endpoints
│       │   ├── public.service.ts       # Paginated feed, blog-by-slug (N+1 safe)
│       │   └── public.controller.ts    # /public/feed, /public/blogs/:slug
│       ├── like/               # Like/unlike with unique constraint
│       │   ├── like.service.ts
│       │   └── like.controller.ts
│       ├── comment/            # Comments with pagination
│       │   ├── comment.service.ts
│       │   └── comment.controller.ts
│       ├── prisma/             # Global Prisma module
│       ├── common/             # Global exception filter
│       ├── app.module.ts       # Root module with ThrottlerGuard
│       └── main.ts             # Bootstrap with CORS, validation, /api prefix
│
├── frontend/                   # Next.js 15 App
│   └── src/
│       ├── app/
│       │   ├── page.tsx                # Landing page
│       │   ├── login/page.tsx          # Login
│       │   ├── register/page.tsx       # Register
│       │   ├── feed/page.tsx           # Public feed with pagination
│       │   ├── blog/[slug]/page.tsx    # Public blog detail + comments
│       │   ├── dashboard/page.tsx      # Protected dashboard
│       │   ├── dashboard/new/page.tsx  # Create post (WYSIWYG-style editor)
│       │   └── dashboard/edit/[id]/page.tsx
│       ├── components/
│       │   ├── Navbar.tsx              # Avatar dropdown, glassmorphism
│       │   ├── BlogCard.tsx            # Reusable card with stats
│       │   ├── LikeButton.tsx          # Optimistic UI updates
│       │   ├── CommentSection.tsx      # Lazy-load, no-reload submit
│       │   ├── CommentItem.tsx
│       │   ├── LoadingSpinner.tsx
│       │   └── EmptyState.tsx
│       ├── lib/
│       │   ├── api.ts                  # Centralized API client, auto JWT injection
│       │   └── auth.tsx                # AuthContext with token persistence
│       └── types/index.ts             # Shared TypeScript interfaces
│
└── README.md
```

### Design Decisions

**Modular backend:** Each domain (auth, blog, public, like, comment) is a self-contained NestJS module with its own service, controller, and DTOs. This keeps responsibilities isolated and makes individual features testable in isolation.

**Global Prisma module:** Marked as `@Global()` so every module gets database access without redundant imports. The service extends `PrismaClient` directly with `onModuleInit` lifecycle hook.

**Centralized API client:** The frontend uses a single `api.ts` abstraction that handles JWT injection, error formatting, and typed responses. Components never call `fetch` directly.

**Context-based auth:** `AuthProvider` wraps the app, persisting tokens in `localStorage` and auto-loading the user on mount. Protected pages check `isAuthenticated` and redirect.

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Create account (name, email, password) |
| `POST` | `/api/auth/login` | No | Login, returns access + refresh tokens |
| `POST` | `/api/auth/refresh` | Yes | Refresh access token |
| `POST` | `/api/auth/me` | Yes | Get current user profile |

### Blog CRUD (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/blogs` | Create blog with auto-generated unique slug |
| `GET` | `/api/blogs` | List authenticated user's blogs |
| `GET` | `/api/blogs/:id` | Get specific blog (owner only) |
| `PATCH` | `/api/blogs/:id` | Update blog (owner only) |
| `DELETE` | `/api/blogs/:id` | Delete blog (owner only) |

### Public (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/feed?page=1&limit=10` | Paginated feed (published only, newest first) |
| `GET` | `/api/public/blogs/:slug` | Single blog by slug (published only) |

### Social (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/blogs/:id/like` | Like (unique constraint prevents duplicates) |
| `DELETE` | `/api/blogs/:id/like` | Unlike |
| `POST` | `/api/blogs/:id/comments` | Add comment |
| `GET` | `/api/blogs/:id/comments` | List comments (no auth needed, paginated) |

---

## Database Schema

```
User           Blog                Like              Comment
────────       ────────            ────────          ────────
id (uuid)      id (uuid)           id (uuid)         id (uuid)
email (uniq)   userId → User       userId → User     userId → User
name           title               blogId → Blog     blogId → Blog
passwordHash   slug (uniq)         createdAt         content
createdAt      content                               createdAt
               summary (nullable)  @@unique(userId,
               isPublished          blogId)           @@index(blogId)
               createdAt                              @@index(createdAt)
               updatedAt
               @@index(isPublished,
                createdAt)
```

**Key constraints:**
- `Like`: `@@unique([userId, blogId])` prevents duplicate likes at the DB level
- `Blog`: composite index on `(isPublished, createdAt)` optimizes the feed query
- `Comment`: indexes on `blogId` and `createdAt` for fast retrieval per post

---

## Security

| Measure | Implementation |
|---------|---------------|
| Password storage | bcrypt with 12 salt rounds |
| Authentication | JWT access tokens (15min) + refresh tokens (7 days) |
| Input validation | `class-validator` with `whitelist: true`, `forbidNonWhitelisted: true` |
| Authorization | Owner-only checks on blog mutations |
| Rate limiting | `@nestjs/throttler` with 3 tiers (3/sec, 20/10sec, 100/min) |
| Error handling | Global exception filter strips internal details from responses |
| CORS | Locked to specific frontend origin |
| Duplicate prevention | DB-level unique constraint on likes |

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Neon free tier)

### Backend
```bash
cd backend
npm install

# Create .env (or edit the existing one)
# DATABASE_URL="postgresql://user:pass@host:5432/dbname"
# JWT_SECRET="your-secret-key"
# FRONTEND_URL="http://localhost:3000"
# PORT=3001

npx prisma generate
npx prisma db push
npm run start:dev          # http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
# Optionally create .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev                # http://localhost:3000
```

---

## Tradeoffs

| Decision | Why | Alternative |
|----------|-----|-------------|
| `localStorage` for JWT | Simplicity for an MVP. SSR auth adds complexity with Next.js App Router | HTTP-only cookies + CSRF tokens for XSS protection |
| Plain `textarea` for editor | Keeps scope manageable; toolbar is visual-only | Tiptap/ProseMirror for real rich text |
| Offset pagination | Simple API contract, works well for moderate data | Cursor-based pagination for large datasets |
| Client-side route protection | `AuthProvider` redirects unauthenticated users | Middleware-based auth with cookie verification |
| Single monorepo, no workspace | Straightforward deployment, each folder deploys independently | Turborepo/Nx for shared types and build caching |

---

## What I Would Improve

1. **HTTP-only cookie auth** with CSRF protection to eliminate XSS risk from `localStorage`
2. **Rich text editor** (Tiptap) with markdown support, image embeds, and code blocks
3. **Image uploads** to S3/Cloudinary with CDN distribution
4. **WebSocket integration** for real-time comment updates and notifications
5. **Full-text search** via PostgreSQL `tsvector` or Elasticsearch for blog discovery
6. **Email verification** on registration with transactional email (SendGrid/Resend)
7. **Comprehensive tests** — unit tests for services, integration tests for API endpoints
8. **CI/CD pipeline** with GitHub Actions for lint, test, build, and deploy

---

## Scaling to 1M Users

### Database Layer
- **Read replicas** for separating read-heavy feed queries from write operations
- **Connection pooling** via PgBouncer to handle thousands of concurrent connections
- **Table partitioning** on `comments` and `likes` by `createdAt` for faster queries on recent data
- **Materialized views** for precomputed feed data (author info, like/comment counts)

### Application Layer
- **Redis caching** for hot paths: feed pages, blog detail, session data
- **Horizontal scaling** with stateless NestJS instances behind a load balancer
- **Background jobs** (BullMQ + Redis) for summary generation, email notifications, analytics
- **Microservice extraction** — split auth, blog, and social into independent services as team grows

### Infrastructure
- **CDN** (CloudFront/Fastly) for static assets and published blog content
- **Rate limiting** with Redis-backed distributed counters (current in-memory throttler doesn't work across instances)
- **Monitoring** with Prometheus + Grafana, structured logging with ELK stack
- **Database indexing** audit — composite indexes on hot query paths, partial indexes for published-only queries

### Data Architecture
- **CQRS** — separate read models (denormalized feed data) from write models (normalized tables)
- **Event sourcing** for the like/comment system to enable analytics and undo functionality
- **Sharding** by user region for geographic distribution if the platform goes global
