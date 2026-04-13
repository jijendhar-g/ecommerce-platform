# API Documentation

## Base URL

- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://api.your-domain.com/api/v1`

## Interactive Documentation

Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "role": "USER"
}
```

---

### POST /auth/login
Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):** Same as register response.

---

## Product Endpoints

### GET /products
Get paginated product list.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (0-based) |
| `size` | int | Page size (default: 10) |
| `keyword` | string | Search keyword |
| `categoryId` | long | Filter by category |
| `minPrice` | decimal | Minimum price |
| `maxPrice` | decimal | Maximum price |
| `sort` | string | Sort field (price, name, rating) |

**Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "...",
      "price": 29.99,
      "stockQuantity": 100,
      "averageRating": 4.5,
      "reviewCount": 23,
      "category": { "id": 1, "name": "Electronics" }
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
  "currentPage": 0
}
```

---

### GET /products/{id}
Get a single product by ID.

---

### POST /products *(Admin only)*
Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Description",
  "price": 49.99,
  "stockQuantity": 50,
  "categoryId": 1
}
```

---

### PUT /products/{id} *(Admin only)*
Update a product.

---

### DELETE /products/{id} *(Admin only)*
Delete a product.

---

## Cart Endpoints

### GET /cart *(Auth required)*
Get current user's cart.

**Response (200):**
```json
{
  "id": 1,
  "items": [
    {
      "id": 1,
      "product": { "id": 1, "name": "...", "price": 29.99 },
      "quantity": 2,
      "subtotal": 59.98
    }
  ],
  "totalPrice": 59.98,
  "itemCount": 2
}
```

---

### POST /cart/items *(Auth required)*
Add item to cart.

**Request Body:**
```json
{ "productId": 1, "quantity": 2 }
```

---

### PUT /cart/items/{itemId} *(Auth required)*
Update item quantity.

**Request Body:**
```json
{ "quantity": 3 }
```

---

### DELETE /cart/items/{itemId} *(Auth required)*
Remove item from cart.

---

## Order Endpoints

### POST /orders *(Auth required)*
Create an order.

**Request Body:**
```json
{
  "addressId": 1,
  "items": [{ "productId": 1, "quantity": 2 }]
}
```

---

### GET /orders *(Auth required)*
Get current user's order history.

---

### GET /orders/{id} *(Auth required)*
Get order details.

---

### POST /orders/{id}/cancel *(Auth required)*
Cancel an order (only if status is PENDING).

---

## Payment Endpoints

### POST /payments/create-intent *(Auth required)*
Create a Stripe payment intent.

**Request Body:**
```json
{ "orderId": 1 }
```

**Response (200):**
```json
{ "clientSecret": "pi_..._secret_..." }
```

---

### POST /payments/webhook
Stripe webhook endpoint (no auth, uses webhook signature).

---

## User Endpoints

### GET /users/profile *(Auth required)*
Get current user profile.

---

### PUT /users/profile *(Auth required)*
Update profile.

---

### GET /users/addresses *(Auth required)*
Get saved addresses.

---

### POST /users/addresses *(Auth required)*
Add a new address.

---

### PUT /users/addresses/{id} *(Auth required)*
Update an address.

---

### DELETE /users/addresses/{id} *(Auth required)*
Delete an address.

---

## Admin Endpoints *(Admin role required)*

### GET /admin/dashboard
Get dashboard statistics (total users, products, orders, revenue).

---

### GET /admin/users
Get paginated user list.

---

### PUT /admin/users/{id}/role
Update user role.

---

### GET /admin/orders
Get all orders (paginated).

---

### PUT /admin/orders/{id}/status
Update order status.

---

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad Request – validation error |
| 401 | Unauthorized – missing or invalid token |
| 403 | Forbidden – insufficient permissions |
| 404 | Not Found – resource doesn't exist |
| 409 | Conflict – duplicate resource |
| 500 | Internal Server Error |

**Error format:**
```json
{
  "status": 404,
  "message": "Product not found with id: 99",
  "timestamp": "2024-01-01T12:00:00Z"
}
```
