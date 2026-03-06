# 🏢 IceCream Hub Architecture

IceCream Hub is a modern e-commerce platform built using a **decentralized microservices architecture** with a **production-grade NGINX reverse proxy** as its single public entry point. It is designed for scalability, high availability, and rapid deployment through full Docker containerization.

---

## 🔍 System Context Diagram (v4.0 — NGINX-First)

The following diagram illustrates the high-level interactions between the user, NGINX, the frontend, and the backend services.

```mermaid
graph TD
    User([User Browser]) -->|:80 HTTP| NGINX[NGINX Reverse Proxy :80]

    subgraph Public_Zone ["Public Zone (Host Network)"]
        NGINX
    end

    subgraph Docker_Network ["Docker Internal Network (icecream-network)"]
        NGINX -->|/api/* proxy_pass| Gateway[API Gateway :8080]
        NGINX -->|/* SSR + static| Frontend[Next.js 14 :3000]

        Gateway --> Auth[Auth Service :8081]
        Gateway --> Product[Product Service :8082]
        Gateway --> Order[Order Service :8083]
        Gateway --> Cart[Cart Service :8084]
        Gateway --> Rec[Recommendation Service :8085]

        Order -->|Feign Client| Product
        Order -->|HTTP DELETE| Cart
    end

    Auth --> AuthDB[(MySQL: auth_db)]
    Product --> ProductDB[(MySQL: product_db)]
    Order --> OrderDB[(MySQL: order_db)]
    Cart --> CartCache[(Redis: cache)]
    Rec --> RecDB[(MySQL: recommendation_db)]
```

---

## 🌐 Networking & Discovery

- **Docker Compose Network**: All services reside on a single dedicated internal bridge network.
- **Service Discovery**: Microservices communicate using Docker Compose container names (e.g., `http://auth-service:8081`, `http://cart-service:8084`) rather than fixed IP addresses.
- **External Exposure**: Only **NGINX (port 80)** is the primary public-facing port. API Gateway (8080) and individual service ports remain mapped for direct development/debugging access, but all production traffic flows through NGINX.
- **Frontend Shielded**: The `frontend` container only uses `expose: 3000` (Docker-internal only) — it is **not** bound to the host machine. NGINX is the only entry point.
- **NGINX Upstream Groups**: NGINX uses two named upstream blocks:
  - `upstream frontend` → `frontend:3000`
  - `upstream api_gateway` → `api-gateway:8080`

---

## 🔀 NGINX Routing Architecture

NGINX is configured in `nginx/nginx.conf` with the following routing rules (in priority order):

| Location Block | Matches | Destination | Cache |
|---|---|---|---|
| `location /api/` | All REST API calls | `api_gateway` upstream | ❌ No cache |
| `location /_next/static/` | Next.js hashed JS/CSS chunks | `frontend` upstream | ✅ 7 days (immutable) |
| `location /images/` | AI-generated product images | `frontend` upstream | ✅ 24 hours |
| `location ~* \.(ico\|png\|…)` | Root-level static files | `frontend` upstream | ✅ 24 hours |
| `location /_next/` | HMR websocket / Next data | `frontend` upstream | ❌ WebSocket upgrade |
| `location /` | All SSR pages (`/`, `/products`, …) | `frontend` upstream | ❌ No cache (personalised) |
| `location /nginx-health` | Health check probe | NGINX itself (`return 200`) | — |

### Static Asset Cache Configuration
```nginx
proxy_cache_path /var/cache/nginx
    levels=1:2
    keys_zone=static_cache:10m
    max_size=100m
    inactive=60m;
```
- **100 MB** on-disk cache with 10 MB shared memory key zone.
- Stale cache entries are served if the upstream is unreachable (`proxy_cache_use_stale error timeout updating`).
- Cache volume is persisted via Docker named volume `nginx_cache` — survives container restarts.

### Gzip Compression
Enabled for `text/plain`, `text/css`, `application/javascript`, `application/json`, `image/svg+xml`, and font types at compression level 6.

### Security Headers (applied globally)
| Header | Value |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-XSS-Protection` | `1; mode=block` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

---

## 📦 Microservices Breakdown

### 0. NGINX Reverse Proxy (Port 80) ★ New in v4.0
- **Technology**: nginx:1.25-alpine, custom `nginx.conf`.
- **Role**: Single public-facing entry point. Terminates HTTP, routes to frontend or API gateway, caches static assets.
- **Build**: `nginx/Dockerfile` — copies `nginx.conf`, creates `/var/cache/nginx`.
- **Key Benefits**:
  - Zero code changes required in frontend or services — NGINX is transparent.
  - Static asset hits never reach the Node.js process (NGINX serves from disk cache).
  - API calls proxied with `Connection: ""` keep-alive to the gateway (32 keepalive connections per upstream).

### 1. Frontend — Next.js 14 (Internal Port 3000)
- **Technology**: Next.js 14, React, `framer-motion`, `lucide-react`, CSS Modules.
- **Exposure**: `expose: 3000` (Docker-internal only). Not reachable from the host directly — all traffic via NGINX.
- **API Proxying**: `next.config.mjs` rewrites `/api/*` → `http://api-gateway:8080` for SSR-side calls. Client-side calls go through NGINX → Gateway.
- **Key Pages**:
  - `/` — Cinematic promo landing (unauthenticated only; auto-redirects logged-in users to `/products`).
  - `/auth` — Unified Login/Signup (also auto-redirects logged-in users).
  - `/products` — Protected catalog with live search, badge-tagged product cards, lifestyle showcase.
  - `/products/[id]` — Product detail with add-to-cart.
  - `/cart` — Cart view with checkout CTA.
  - `/orders` — Order history (accessible via profile dropdown).
  - `/checkout` — Checkout completion.
- **Auth Strategy**: JWT token payload stored in `localStorage` as `user` key. Custom `auth-change` event broadcast on login/logout for cross-component sync.
- **Route Guards**: Client-side — `/products`, `/cart`, `/orders`, `/checkout` redirect to `/auth` if no session. `/`, `/auth` redirect to `/products` if session exists.

### 2. Auth Service — Java/Spring Boot (Port 8081)
- **Responsibility**: User registration, login, JWT token generation, and auto-provisioning.
- **Key Feature — Auto-Registration**: Backend logic supports first-time-login auto-registration flows.
- **Key Feature — Default Admin**: `admin` / `admin` credentials are seeded on application startup via a `CommandLineRunner` or similar bootstrap mechanism.
- **Security**: JWT signed tokens. Spring Security configured to permit `/api/auth/**` without authentication.
- **Data Store**: MySQL `auth_db` with a `users` table managed via Hibernate `ddl-auto: update`.
- **Config**: Uses `org.hibernate.dialect.MySQLDialect` (not the deprecated `MySQL8Dialect`).

### 3. Product Service — Java/Spring Boot (Port 8082)
- **Responsibility**: Manages the premium ice cream catalog: names, flavors, prices, descriptions, and AI-generated image paths.
- **Data Store**: MySQL `product_db`. Product `imageUrl` fields point to files in `/images/` served from the Next.js `public/` directory (and cached by NGINX).
- **Seeded Products**: `Vanilla Dream` ($4.99), `Double Chocolate` ($5.49), `Strawberry Fields` ($4.99) — each with a timestamped AI-generated PNG.
- **Image Naming Pattern**: `/images/{flavor}_ice_cream_{timestamp}.png`.

### 4. Cart Service — Python/FastAPI + Redis (Port 8084)
- **Responsibility**: High-speed, transient shopping cart management per `userId`.
- **Data Store**: Redis — all cart data is stored as Redis hashes/JSON keyed by `cart:{userId}`.
- **Networking Config**: Uses `REDIS_HOST` env variable (set to `redis` in Compose) — not hardcoded `localhost`.
- **Auto-Clear**: Cart is deleted by Order Service after a successful order via `DELETE /api/cart/{userId}`.

### 5. Order Service — Java/Spring Boot (Port 8083)
- **Responsibility**: Full checkout lifecycle management.
- **Inter-Service Calls**:
  - **Feign Client → Product Service**: Validates product existence and pricing before creating an order.
  - **HTTP DELETE → Cart Service**: Clears the user's cart after successful order creation via `CART_SERVICE_URL` env variable.
- **Data Store**: MySQL `order_db`.

### 6. Recommendation Service — Python/FastAPI + MySQL (Port 8085)
- **Responsibility**: Popularity-based product analytics and discovery.
- **Algorithm**: Ranks products by `order_count` in `recommendation_db`. No direct runtime dependency on other live services.
- **Networking Config**: Uses `DATABASE_URL` env variable (`mysql+pymysql://...`) — not hardcoded `localhost`.

### 7. API Gateway — Spring Cloud Gateway (Port 8080)
- **Responsibility**: Second-layer routing for microservice-to-microservice differentiation (after NGINX).
- **Routing**: Path-prefix based — `/api/auth/**` → auth-service, `/api/products/**` → product-service, etc.
- **Access Pattern**: In production, reached only from NGINX (not directly from browser). In development, also accessible directly on port 8080.

---

## 🗏️ Data Isolation

Each service owns exactly one database — there is **no shared schema**:

| Service | Database | Notes |
|---|---|---|
| Auth | `auth_db` | Independent. No outbound service calls. |
| Product | `product_db` | Independent. Referenced by Order & Recommendation, but makes no outbound calls. |
| Cart | Redis `icecream-redis` | Independent. No MySQL. No inter-service calls. |
| Order | `order_db` | Depends on Product (Feign) and Cart (HTTP DELETE) at runtime. |
| Recommendation | `recommendation_db` | Depends on MySQL only. No runtime service dependencies. |

All MySQL databases are created by `init-scripts/init.sql` which runs on the MySQL container's first boot.

---

## 🗏️ Deployment Strategy

The application is fully containerized using **Docker**. The `docker-compose.yml` orchestrates **11 containers**:

- **NGINX 1.25 Alpine** (`nginx:1.25-alpine`) — 15 MB footprint reverse proxy.
- **Multi-stage Gradle builds** for Java services (Eclipse Temurin JDK base image + local `gradlew` wrapper matching project's Gradle 9.3.1).
- **Lightweight Python images** (`python:3.10-slim` + uvicorn) for FastAPI services.
- **Node.js** (`node:20`) for the Next.js production build.
- **Health-check ordering** via `depends_on` with `condition: service_healthy` on MySQL and Redis.
- **Persistent named volumes** (`mysql_data`, `redis_data`, `nginx_cache`) for data safety across restarts.
- **Environment variable injection** for all inter-service URLs and credentials.

### Container Dependency Graph
```
mysql ──────────────────────────────────────────┐
redis ────────────────────────────────┐          │
                                      ↓          ↓
                               cart-service   auth-service
                                      │       product-service
                                      │       order-service
                                      │       recommendation-service
                                      └──────────────┐
                                                     ↓
                                              api-gateway
                                                     │
                                              frontend
                                                     │
                                              nginx (port 80) ← USER
```

### Known Bug Fixes Applied During Dockerization
| Issue | Fix |
|---|---|
| Hibernate `MySQL8Dialect` deprecated | Changed to `org.hibernate.dialect.MySQLDialect` |
| Gradle image mismatch | Replaced `gradle:8.5` Docker image with local `./gradlew` wrapper (Gradle 9.3.1) |
| ESLint unescaped entity | `haven't` → `haven&apos;t` in cart page |
| Docker symlink conflict (acorn) | Added `frontend/.dockerignore` excluding `node_modules`, `.next`, `.git` |
| Next.js font network timeout | Replaced `next/font/google` (network call) with local font fallback during Docker build |
| Python hardcoded `localhost` | Replaced with `REDIS_HOST` / `DATABASE_URL` environment variables |
| Frontend port 3000 exposed to host | Changed from `ports` to `expose` — NGINX is the only public entry point |

---

## 🖼️ AI-Generated Assets

All product and lifestyle images are AI-generated and stored in `frontend/public/images/`. When requested via `/images/*`, NGINX serves them from its 24-hour proxy cache after the first fetch:

| File | Used In |
|---|---|
| `floating_ice_cream_hero_new.png` | Landing page hero + Products page hero background |
| `vanilla_ice_cream_{ts}.png` | Vanilla Dream product card |
| `chocolate_ice_cream_{ts}.png` | Double Chocolate product card |
| `strawberry_ice_cream_{ts}.png` | Strawberry Fields product card |
| `flavor_vanilla_dream_new.png` | Landing page collection card |
| `mint.png` | Mint Symphony collection card |
| `espresso.png` | Midnight Espresso collection card |
| `mango.png` | Artisan Mango collection card + Featured row |
| `midnight_chocolate.png` | Lifestyle showcase grid |
| `lifestyle_1.png` | Brand philosophy section + Lifestyle grid |
| `lifestyle_2.png` | Lifestyle showcase grid |

---

> **Architecture Documented by:** Akhil Mylaram  
> **Last Updated:** 2026-03-07 — v4.0 Architecture (NGINX-First Reverse Proxy)
