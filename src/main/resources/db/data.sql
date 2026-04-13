-- E-Commerce Platform Sample Data
-- Insert after schema.sql

-- Admin user (password: admin123)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, enabled) VALUES
(1, 'Admin', 'User', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTTYVFGiZ2u', '555-0001', TRUE);

INSERT IGNORE INTO user_roles (user_id, role) VALUES (1, 'ROLE_ADMIN'), (1, 'ROLE_CUSTOMER');

-- Customer user (password: customer123)
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, enabled) VALUES
(2, 'John', 'Doe', 'customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-0002', TRUE);

INSERT IGNORE INTO user_roles (user_id, role) VALUES (2, 'ROLE_CUSTOMER');

-- Categories
INSERT IGNORE INTO categories (id, name, description, active) VALUES
(1, 'Electronics', 'Electronic devices and accessories', TRUE),
(2, 'Clothing', 'Fashion and apparel', TRUE),
(3, 'Books', 'Books, e-books and educational materials', TRUE),
(4, 'Home & Garden', 'Home furnishings and garden supplies', TRUE),
(5, 'Sports', 'Sports equipment and outdoor gear', TRUE);

-- Products
INSERT IGNORE INTO products (id, name, description, price, stock_quantity, sku, active, average_rating, review_count, category_id) VALUES
(1, 'Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD', 1299.99, 50, 'LAPTOP-001', TRUE, 4.5, 24, 1),
(2, 'Wireless Headphones', 'Noise-cancelling Bluetooth headphones with 30h battery', 199.99, 100, 'AUDIO-001', TRUE, 4.3, 87, 1),
(3, 'Smartphone X12', 'Latest smartphone with triple camera and 5G support', 899.99, 75, 'PHONE-001', TRUE, 4.7, 156, 1),
(4, 'Men''s Running Shoes', 'Lightweight running shoes with cushioned sole', 89.99, 200, 'SHOES-001', TRUE, 4.2, 43, 2),
(5, 'Women''s Yoga Pants', 'Flexible and comfortable yoga pants for all activities', 49.99, 150, 'YOGA-001', TRUE, 4.6, 78, 2),
(6, 'Spring Boot in Action', 'Comprehensive guide to building Spring Boot applications', 39.99, 300, 'BOOK-001', TRUE, 4.8, 92, 3),
(7, 'Coffee Maker Deluxe', 'Programmable coffee maker with built-in grinder', 149.99, 60, 'HOME-001', TRUE, 4.4, 35, 4),
(8, 'Yoga Mat Premium', 'Non-slip yoga mat with alignment lines, 6mm thick', 34.99, 250, 'SPORT-001', TRUE, 4.5, 120, 5);

-- Addresses for admin user
INSERT IGNORE INTO addresses (id, user_id, street, city, state, zip_code, country, is_default) VALUES
(1, 1, '123 Admin Street', 'New York', 'NY', '10001', 'US', TRUE);

-- Addresses for customer user
INSERT IGNORE INTO addresses (id, user_id, street, city, state, zip_code, country, is_default) VALUES
(2, 2, '456 Customer Ave', 'Los Angeles', 'CA', '90001', 'US', TRUE);
