# E-Commerce Platform

A production-ready Spring Boot E-Commerce Platform with JWT authentication, Stripe payments, and comprehensive REST API.

## Features

- **Authentication**: JWT-based auth with registration/login
- **Products**: CRUD with search, filtering, pagination
- **Categories**: Product categorization
- **Shopping Cart**: Add/update/remove items
- **Orders**: Create orders from cart with stock management
- **Payments**: Stripe payment integration
- **Admin Panel**: Full admin management for products, categories, users, orders
- **Email Notifications**: Order confirmation and status updates
- **API Documentation**: Swagger/OpenAPI UI
- **Security**: Spring Security with role-based access control (ADMIN/CUSTOMER)

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **Spring Security** + JWT (jjwt 0.11.5)
- **Spring Data JPA** + Hibernate
- **MySQL** (prod) / **H2** (dev/test)
- **Stripe Java SDK**
- **SpringDoc OpenAPI 2.3** (Swagger UI)
- **Lombok**
- **Docker** + **Docker Compose**

## Quick Start

### Run with H2 (Dev Mode)
```bash
mvn spring-boot:run
```
App starts on `http://localhost:8080/api/v1`

### Run with Docker Compose (MySQL)
```bash
STRIPE_SECRET_KEY=sk_test_xxx docker-compose up
```

### API Documentation
Visit `http://localhost:8080/api/v1/swagger-ui.html`

### H2 Console (dev only)
Visit `http://localhost:8080/api/v1/h2-console`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | Public | Register user |
| POST | /auth/login | Public | Login, get JWT |
| GET | /products | Public | List products |
| GET | /products/{id} | Public | Get product |
| GET | /products/search | Public | Search products |
| GET | /categories | Public | List categories |
| GET | /cart | User | View cart |
| POST | /cart/items | User | Add to cart |
| POST | /orders | User | Create order |
| GET | /orders | User | Order history |
| POST | /payments/intent | User | Stripe payment |
| GET | /admin/users | Admin | List users |
| POST | /admin/products | Admin | Create product |
| PUT | /admin/orders/{id}/status | Admin | Update order |

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL JDBC URL | H2 in-memory (dev) |
| `DATABASE_USERNAME` | DB username | sa |
| `DATABASE_PASSWORD` | DB password | (empty) |
| `STRIPE_SECRET_KEY` | Stripe secret key | sk_test_placeholder |
| `MAIL_HOST` | SMTP host | localhost |
| `MAIL_USERNAME` | SMTP username | - |
| `MAIL_PASSWORD` | SMTP password | - |

### Default Credentials (dev seed data)
- **Admin**: admin@ecommerce.com / password123
- **Customer**: john@example.com / password123

## Running Tests

```bash
mvn test
```

## Building

```bash
mvn clean package -DskipTests
java -jar target/ecommerce-platform-1.0.0.jar
```

## License

MIT