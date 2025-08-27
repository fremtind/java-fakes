package no.demo.webshop.product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductClient productClient;

    // Constructor injection - no @Autowired needed with single constructor
    public ProductService(ProductClient productClient) {
        this.productClient = productClient;
    }

    public List<Product> getAllProducts() {
        return productClient.getAllProducts();
    }

    public Product getProductById(Long id) {
        return productClient.getProductById(id);
    }

}
