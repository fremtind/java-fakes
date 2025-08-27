package no.demo.webshop.order;

import no.demo.webshop.product.Product;

import java.io.Serializable;

public class OrderLine implements Serializable {
    private Long id;
    private Product product;
    private Integer quantity;
    private Double price;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
