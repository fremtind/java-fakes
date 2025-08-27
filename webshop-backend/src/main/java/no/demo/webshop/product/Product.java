package no.demo.webshop.product;

import java.io.Serializable;

public class Product implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String category;
    private Integer stockQuantity;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public void setCategory(String category) {
        this.category = category;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}
