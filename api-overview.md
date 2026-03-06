# 🍦 IceCream Hub — API Overview

This document describes the REST API endpoints exposed by each microservice, their request/response shapes, authentication requirements, and how they interact in the end-to-end user flow.

---

## 🚦 Unified Entry Point

All API requests from the frontend are routed through the **API Gateway** on port `8080`. The gateway performs path-based proxying to the appropriate downstream microservice.

| Gateway Path | Target Service | Internal Port |
|---|---|---|
| `/api/auth/**` | `auth-service` | `8081` |
| `/api/products/**` | `product-service` | `8082` |
| `/api/orders/**` | `order-service` | `8083` |
| `/api/cart/**` | `cart-service` | `8084` |
| `/api/recommendations/**` | `recommendation-service` | `8085` |

---

## 🔄 End-to-End User Flow (v3.0)

1. **System Initialization**: On startup, `auth-service` seeds a default administrative user: **email** `admin@hub.com` / **password** `admin` (also works with username `admin`).

2. **Landing Page (`/`)**: Unauthenticated users see the cinematic promo page with `Strict Route Guard` — if a session is detected in `localStorage`, they are **immediately redirected to `/products`** without rendering the promo page.

3. **Authentication (`/auth`)**: The unified Login/Signup page handles both flows:
   - **Login**: `POST /api/auth/login` with `{ email, password }` → returns `{ token, name, email, id, ... }`.
   - **Signup**: `POST /api/auth/register` with `{ name, email, password, address }` → returns same shape on success.
   - **Auto-Registration**: Users can also be auto-registered on first login attempt (backend logic).
   - On success, the token payload is saved to `localStorage` as `user`, and an `auth-change` event is dispatched.
   - Logged-in users who visit `/auth` are immediately redirected to `/products`.

4. **Protected Catalog (`/products`)**: Authentication is enforced client-side:
   - If no `user` key exists in `localStorage`, the user is immediately redirected to `/auth`.
   - On load, `GET /api/products` is called to fetch the full catalog.
   - A **live client-side search** filters products by `name` or `flavor` string without any additional API calls.

5. **Product Detail (`/products/{id}`)**: Calls `GET /api/products/{id}` to retrieve detailed product info including AI image paths.

6. **Cart Management (`/cart`)**: The cart is tied to the authenticated `user.id`:
   - `GET /api/cart/{userId}` — retrieves current cart items and total price.
   - `POST /api/cart/{userId}/items` — adds an item `{ productId, quantity }` to the cart.
   - `DELETE /api/cart/{userId}` — clears the entire cart (called automatically post-checkout).
   - **Empty Cart UX**: The "Add the products" CTA redirects to `/`, which triggers the strict routing rule sending the user back to `/products`.

7. **Checkout (`/checkout`)**: Calls `POST /api/orders` with `{ userId }`. The Order Service:
   - Validates items via a **Feign Client** call to Product Service.
   - Persists the order in `order_db`.
   - Automatically calls `DELETE /api/cart/{userId}` to clear the session cart.

8. **Order History (`/orders`)**: Accessible via the **Profile Dropdown** in the Navbar.
   - Calls `GET /api/orders/user/{userId}` to list all historical orders.

9. **Recommendations**: `GET /api/recommendations/popular` returns popularity-ranked products based on order analytics stored in `recommendation_db`.

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

## 🌐 Frontend API Client (`src/lib/api.ts`)

All frontend API calls are centralized in `lib/api.ts` using the Next.js built-in fetch proxied through the gateway:

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

---

> **API Document Maintained by:** Akhil Mylaram  
> **Last Updated:** 2026-03-07 — Production API Version 3.0
