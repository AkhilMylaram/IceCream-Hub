# ðŸ¦ IceCream Hub â€” API Overview

This document describes the REST API endpoints exposed by each microservice, their request/response shapes, and their roles in the system.

---

## ðŸš¦ Unified Entry Point
All API requests are routed through the **API Gateway** on port `8080`.

| Path | Target Service |
|---|---|
| `/api/auth/**` | `auth-service:8081` |
| `/api/products/**` | `product-service:8082` |
| `/api/orders/**` | `order-service:8083` |
| `/api/cart/**` | `cart-service:8084` |
| `/api/recommendations/**` | `recommendation-service:8085` |

---

## 🔄 End-to-End User Flow (v2.0)

1. **System Initialization**: `auth-service` seeds a default administrative user (`admin`/`admin`) upon container startup.
2. **Onboarding**: User provides email/password. Auth Service handles login or **auto-registers** new users. Successful authentication redirects the user directly to the `/products` catalog.
3. **Strict Root Routing (v3)**: Authenticated users are forbidden from seeing the promotional `/` page or the `/auth` login page. If an active session lands on either, they are immediately rebounded straight to their `/products` catalog, preserving the protected, closed-ecosystem feel.
4. **Authentication Required**: Users must be logged in to view the catalog or manage their cart. Unauthenticated users attempting to access these routes are redirected to the Login page.
5. **Browsing (Protected)**: Authenticated frontend fetches the premium catalog from Product Service (`GET /api/products`), complete with client-side, dynamic search filters via name and flavor.
6. **Engagement**: User views HD AI assets and dynamic product badges, welcomed with a personalized greeting header (`Welcome back, {user.name}`).
7. **Empty Cart Recovery**: Users with empty carts clicking "Add the products" are swept to the root directory (`/`), triggering the Strict Routing rule from step 3 and seamlessly returning them to the dashboard.
8. **Cart Management (Protected)**: User adds items to their personal Redis-backed cart via Cart Service (`POST /api/cart/{userId}/items`).
9. **Checkout**: User places an order via Order Service (`POST /api/orders`).
10. **Automation**: Order Service triggers **automatic cart cleanup** (`DELETE /api/cart/{userId}`) upon success.
11. **Order History**: User views past purchases using the new My Orders page (`GET /api/orders/user/{userId}`), accessible via the minimalist top-bar profile dropdown.
11. **Personalization**: User sees popularity-based suggestions from Recommendation Service (`GET /api/recommendations/popular`).

---

## ðŸ› ï¸ Service-Specific Endpoints

### ðŸ” Auth Service (Port 8081)
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a JWT token.

### ðŸ¨ Product Service (Port 8082)
- `GET /api/products`: Retrieve all premium ice cream products.
- `GET /api/products/{id}`: Get detailed info for a specific product.
- `POST /api/products`: (Internal/Admin) Seed new product data.

### ðŸ›’ Cart Service (Port 8084)
- `GET /api/cart/{userId}`: Retrieve current items and total price.
- `POST /api/cart/{userId}/items`: Add an item to the cart.
- `DELETE /api/cart/{userId}`: Clear the cart (triggered post-checkout).

### ðŸ“¦ Order Service (Port 8083)
- `POST /api/orders`: Create a new order (validates items via Product Service).
- `GET /api/orders/user/{userId}`: List order history for a user.

### ðŸ“ˆ Recommendation Service (Port 8085)
- `GET /api/recommendations/popular`: Fetch trending products based on sales analytics.

---

> **API Document Maintained by:** Akhil  
> **Last Updated:** 2026-03-06 â€” Production API Version 2.0
