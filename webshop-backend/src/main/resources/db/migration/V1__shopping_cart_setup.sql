CREATE TABLE shopping_cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255),
    total_amount DOUBLE
);

CREATE TABLE shopping_cart_products (
    cart_id BIGINT,
    product_id BIGINT,
    product_name VARCHAR(255),
    price DOUBLE,
    quantity INTEGER,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(id)
);
