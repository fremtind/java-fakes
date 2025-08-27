package no.demo.webshop.product;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductSearchController {

    private final ProductService productService;

    // Constructor injection - no @Autowired needed with single constructor
    public ProductSearchController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam(required = false) String name,
                                        @RequestParam(required = false) String category) {
        // For simplicity, we'll return all products and let the frontend filter
        return productService.getAllProducts();
    }
}
