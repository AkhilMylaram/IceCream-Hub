# 🍦 IceCream Hub — API Overview

This document describes the REST API endpoints exposed by each microservice, their request/response shapes, authentication requirements, and how they interact in the end-to-end user flow.

---

## 🌐 Traffic Flow (v4.0 — NGINX-First Architecture)

All user traffic now enters through **NGINX on port 80**. NGINX makes the routing decision:

```
Browser (port 80)
    └── NGINX Reverse Proxy
            ├── /api/*  ──────────────→  API Gateway (port 8080)
            │                                ├── /api/auth/**        → Auth Service :8081
            │                                ├── /api/products/**    → Product Service :8082
            │                                ├── /api/orders/**      → Order Service :8083
            │                                ├── /api/cart/**        → Cart Service :8084
            │                                └── /api/recommendations/** → Recommendation Service :8085
            │
            └── /* (SSR + static) ──→  Next.js Frontend (port 3000, internal)
                    ├── /_next/static/*  (NGINX cached 7 days)
                    ├── /images/*        (NGINX cached 24 hours)
                    └── /               (SSR, not cached)
```

### NGINX Routing Table

| Request Path | Backend | Cache TTL |
|---|---|---|
| `/api/*` | `api-gateway:8080` | None (dynamic) |
| `/_next/static/*` | `frontend:3000` | 7 days |
| `/images/*` | `frontend:3000` | 24 hours |
| `*.ico, *.woff2, *.png …` | `frontend:3000` | 24 hours |
| `/` and all other routes | `frontend:3000` | None (SSR) |
| `/nginx-health` | NGINX itself | — |

### API Gateway Path Routing (via NGINX → Gateway)

| Gateway Path | Target Service | Internal Port |
|---|---|---|
| `/api/auth/**` | `auth-service` | `8081` |
| `/api/products/**` | `product-service` | `8082` |
| `/api/orders/**` | `order-service` | `8083` |
| `/api/cart/**` | `cart-service` | `8084` |
| `/api/recommendations/**` | `recommendation-service` | `8085` |

---

## 🔄 End-to-End User Flow (v4.0)

1. **System Initialization**: On startup, `auth-service` seeds a default administrative user: **email** `admin@hub.com` / **password** `admin` (also works with username `admin`). NGINX and API Gateway are both healthy before the first user request is served.

2. **Entry Point**: User navigates to `http://localhost` (port 80). NGINX intercepts the request and proxies it to `frontend:3000`.

3. **Landing Page (`/`)**: Unauthenticated users see the cinematic promo page with `Strict Route Guard` — if a session is detected in `localStorage`, they are **immediately redirected to `/products`** without rendering the promo page.

4. **Authentication (`/auth`)**: The unified Login/Signup page handles both flows:
   - **Login**: `POST /api/auth/login` → NGINX → API Gateway → Auth Service. Body: `{ email, password }` → returns `{ token, name, email, id, ... }`.
   - **Signup**: `POST /api/auth/register` → same route. Body: `{ name, email, password, address }` → returns same shape on success.
   - **Auto-Registration**: Users can also be auto-registered on first login attempt (backend logic).
   - On success, the token payload is saved to `localStorage` as `user`, and an `auth-change` event is dispatched.
   - Logged-in users who visit `/auth` are immediately redirected to `/products`.

5. **Protected Catalog (`/products`)**: Authentication is enforced client-side:
   - If no `user` key exists in `localStorage`, the user is immediately redirected to `/auth`.
   - On load, `GET /api/products` is called → NGINX → API Gateway → Product Service to fetch the full catalog.
   - Product images at `/images/*` are served from NGINX's proxy cache (24-hour TTL), not hitting Next.js on cache hits.
   - A **live client-side search** filters products by `name` or `flavor` string without any additional API calls.

6. **Product Detail (`/products/{id}`)**: Calls `GET /api/products/{id}` to retrieve detailed product info including AI image paths.

7. **Cart Management (`/cart`)**: The cart is tied to the authenticated `user.id`:
   - `GET /api/cart/{userId}` — retrieves current cart items and total price.
   - `POST /api/cart/{userId}/items` — adds an item `{ productId, quantity }` to the cart.
   - `DELETE /api/cart/{userId}` — clears the entire cart (called automatically post-checkout).
   - **Empty Cart UX**: The "Add the products" CTA redirects to `/`, which triggers the strict routing rule sending the user back to `/products`.

8. **Checkout (`/checkout`)**: Calls `POST /api/orders` with `{ userId }`. The Order Service:
   - Validates items via a **Feign Client** call to Product Service.
   - Persists the order in `order_db`.
   - Automatically calls `DELETE /api/cart/{userId}` to clear the session cart.

9. **Order History (`/orders`)**: Accessible via the **Profile Dropdown** in the Navbar.
   - Calls `GET /api/orders/user/{userId}` to list all historical orders.

10. **Recommendations**: `GET /api/recommendations/popular` returns popularity-ranked products based on order analytics stored in `recommendation_db`.

---

## 🛠️ Service-Specific Endpoints

### 🔐 Auth Service (Port 8081)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create a new user account. Body: `{ name, email, password, address }` |
| `POST` | `/api/auth/login` | ❌ | Authenticate. Body: `{ email, password }`. Returns JWT token payload. |

**Response shape (login/register success):**
```json
{
  "token": "eyJhbGci...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 🍨 Product Service (Port 8082)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/products` | ✅ (session) | Retrieve all ice cream products in the catalog. |
| `GET` | `/api/products/{id}` | ✅ (session) | Get detailed info for a specific product. |
| `POST` | `/api/products` | ❌ (internal/admin) | Seed or create product data. |

**Product response shape:**
```json
{
  "id": 1,
  "name": "Vanilla Dream",
  "flavor": "Vanilla",
  "price": 4.99,
  "description": "Madagascar vanilla beans...",
  "imageUrl": "/images/vanilla_ice_cream_1772789459043.png"
}
```

> **Note on image delivery**: The `imageUrl` path (`/images/…`) is resolved by NGINX, which caches the image from `frontend:3000` for 24 hours. On a cache hit, the image is served directly by NGINX without touching the Next.js container.

---

### 🛒 Cart Service (Port 8084) — Python/FastAPI + Redis

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/cart/{userId}` | ✅ | Retrieve current cart items and total price for a user. |
| `POST` | `/api/cart/{userId}/items` | ✅ | Add an item to the cart. Body: `{ productId, quantity }` |
| `DELETE` | `/api/cart/{userId}` | ✅ (internal) | Clear the entire cart. Called automatically post-checkout. |

**GET Cart response shape:**
```json
{
  "items": [
    { "productId": 2, "quantity": 1, "price": 5.49 }
  ],
  "total": 5.49
}
```

---

### 📦 Order Service (Port 8083)

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/orders` | ✅ | Create a new order. Body: `{ userId }`. Validates via Product Service (Feign), then clears cart. |
| `GET` | `/api/orders/user/{userId}` | ✅ | List all orders for a user (Order History page). |

**POST Order response shape:**
```json
{
  "orderId": 101,
  "userId": 1,
  "status": "PLACED",
  "totalAmount": 15.47,
  "createdAt": "2026-03-07T03:00:00Z"
}
```

---

### 📈 Recommendation Service (Port 8085) — Python/FastAPI + MySQL

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/api/recommendations/popular` | ❌ | Fetch trending products based on order-history analytics. |

**Response shape:**
```json
[
  { "productId": 3, "name": "Strawberry Fields", "orderCount": 142 },
  { "productId": 1, "name": "Vanilla Dream", "orderCount": 98 }
]
```

---

### 🔧 NGINX Health Endpoint

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/nginx-health` | Returns `200 healthy` — liveness check for the NGINX container. |

---

## 🌐 Frontend API Client (`src/lib/api.ts`)

All frontend API calls are centralized in `lib/api.ts`. Because NGINX is now the public gateway, all calls go to `/api/*` relative paths which NGINX routes to the API Gateway:

| Function | HTTP Call | Used In |
|---|---|---|
| `fetchProducts()` | `GET /api/products` | `/products` page |
| `fetchProduct(id)` | `GET /api/products/{id}` | `/products/[id]` page |
| `fetchRecommendations()` | `GET /api/recommendations/popular` | Recommendations widget |
| `fetchCart(userId)` | `GET /api/cart/{userId}` | `/cart` page |
| `addToCart(userId, item)` | `POST /api/cart/{userId}/items` | Product detail page |
| `createOrder(userId)` | `POST /api/orders` | `/checkout` page |
| `loginUser(email, password)` | `POST /api/auth/login` | `/auth` page |
| `registerUser(userData)` | `POST /api/auth/register` | `/auth` page |
| `fetchOrders(userId)` | `GET /api/orders/user/{userId}` | `/orders` page |

**Request path resolution chain:**
```
Browser fetch("/api/products")
  → NGINX :80 matches /api/* → proxy_pass http://api_gateway
    → API Gateway :8080 matches /api/products/** → product-service:8082
      → Spring Boot REST Controller → MySQL product_db
```

---

> **API Document Maintained by:** Akhil Mylaram  
> **Last Updated:** 2026-03-07 — Production API Version 4.0 (NGINX-First Architecture)
