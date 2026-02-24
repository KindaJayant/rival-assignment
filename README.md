# Secure Blog Platform

A production-ready blog platform with NestJS backend and Next.js 15 frontend, featuring JWT authentication, blog CRUD, public feed, like/comment system, and rate limiting.

## Tech Stack

### Backend
- **NestJS** (latest) — TypeScript strict mode
- **PostgreSQL** — Relational database
- **Prisma ORM** — Type-safe database access
- **JWT** — Token-based authentication (access + refresh tokens)
- **bcrypt** — Password hashing (12 rounds)
- **@nestjs/throttler** — Rate limiting

### Frontend
- **Next.js 15** — App Router, TypeScript
- **Vanilla CSS** — Custom dark theme design system
- **Client-side auth** — Context-based JWT management

## Architecture

```
assignment/
├── backend/              # NestJS API
│   ├── prisma/           # Schema + migrations
│   └── src/
│       ├── auth/         # JWT auth (register, login, refresh, guards)
│       ├── blog/         # Blog CRUD (owner-only mutations)
│       ├── public/       # Public feed + blog-by-slug
│       ├── like/         # Like/unlike with unique constraint
│       ├── comment/      # Comments with pagination
│       ├── common/       # Global exception filter
│       └── prisma/       # Global Prisma service
├── frontend/             # Next.js 15 App
│   └── src/
│       ├── app/          # Pages (landing, feed, dashboard, blog detail)
│       ├── components/   # BlogCard, LikeButton, CommentSection, etc.
│       ├── lib/          # API client + auth context
│       └── types/        # TypeScript interfaces
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env  # or edit .env directly
# Set DATABASE_URL to your PostgreSQL connection string
# Set JWT_SECRET to a secure random string

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start development server
npm run start:dev  # Runs on http://localhost:3001
```

### Frontend Setup

```bash
cd frontend
npm install

# Optional: set API URL (defaults to http://localhost:3001/api)
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

npm run dev  # Runs on http://localhost:3000
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/refresh | Yes | Refresh tokens |
| POST | /api/auth/me | Yes | Get current user |

### Blog CRUD (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/blogs | Create blog |
| GET | /api/blogs | List own blogs |
| GET | /api/blogs/:id | Get own blog by ID |
| PATCH | /api/blogs/:id | Update (owner only) |
| DELETE | /api/blogs/:id | Delete (owner only) |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/public/feed | Paginated feed (?page=1&limit=10) |
| GET | /api/public/blogs/:slug | Blog by slug |

### Social
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/blogs/:id/like | Yes | Like blog |
| DELETE | /api/blogs/:id/like | Yes | Unlike blog |
| POST | /api/blogs/:id/comments | Yes | Add comment |
| GET | /api/blogs/:id/comments | No | List comments |

## Database Schema

4 models: **User**, **Blog**, **Like**, **Comment**

Key constraints:
- `Like`: `@@unique([userId, blogId])` prevents duplicate likes
- `Comment`: `@@index([blogId])`, `@@index([createdAt])` for query performance
- `Blog`: `slug` unique, `@@index([isPublished, createdAt])` for feed optimization

## Security Features

- **Password hashing**: bcrypt with 12 salt rounds
- **JWT authentication**: 15-minute access tokens, 7-day refresh tokens
- **Input validation**: class-validator with whitelist + forbidNonWhitelisted
- **Owner-only mutations**: Blog edit/delete restricted to author
- **Rate limiting**: Multi-tier throttling (3/sec, 20/10sec, 100/min)
- **CORS**: Configured with specific origin
- **Structured error responses**: Global exception filter

## Frontend Features

- **Optimistic UI**: Like button updates immediately, reverts on error
- **Auth protection**: Dashboard routes redirect to login
- **Pagination**: Feed page with page controls
- **Comment section**: No-reload comment submission
- **Responsive design**: Mobile-first with breakpoints at 768px and 480px
- **Dark theme**: Premium design with gradient accents, glassmorphism navbar

## Tradeoffs Made

1. **Client-side auth over SSR auth**: Used localStorage for JWT storage instead of HTTP-only cookies for simplicity. For production, HTTP-only cookies with CSRF protection would be more secure.
2. **Text content over rich editor**: Used plain textarea instead of a rich text editor (Markdown/WYSIWYG) to keep scope manageable.
3. **Offset pagination over cursor-based**: Simpler to implement, but cursor-based would be better for large datasets.
4. **No image upload**: Focused on text content. Image upload with S3/Cloudinary would be a natural next step.

## What I Would Improve

- Add **HTTP-only cookie** auth with CSRF protection
- Implement **rich text editor** (TipTap/Slate)
- Add **image upload** with cloud storage
- Implement **WebSocket** for real-time comment updates
- Add **search functionality** with full-text search
- Implement **email verification** on registration
- Add **unit and integration tests** with Jest
- Set up **CI/CD pipeline** with GitHub Actions

## Scaling to 1M Users

1. **Database**: Read replicas, connection pooling (PgBouncer), partitioning for comments/likes tables
2. **Caching**: Redis for feed caching, blog detail cache, session management
3. **CDN**: Static assets and published blog content via CloudFront/Fastly
4. **Search**: Elasticsearch for full-text blog search
5. **Background jobs**: BullMQ + Redis for summary generation, email notifications
6. **Microservices**: Split auth, blog, and social into separate services
7. **Load balancing**: Horizontal scaling behind Nginx/ALB
8. **Database indexing**: Composite indexes on hot query paths
9. **Rate limiting**: Distributed rate limiting with Redis
10. **Monitoring**: Prometheus + Grafana, structured logging with ELK stack
