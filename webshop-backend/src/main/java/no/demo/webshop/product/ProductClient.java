package no.demo.webshop.product;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
/**
 * Client for interacting with the external Order System's Product API.
 * In a real application the integration would map from a bespoke API response class to a product object.
 * Here we just use the product object since class is never called when running fakes. It is the class we fake...
 */
@Service
public class ProductClient {

    private static final String PRODUCTS_ENDPOINT = "/api/products";

    private final RestTemplate restTemplate;
    private final String ordersystemBaseUrl;

    public ProductClient(RestTemplate restTemplate,
            @Value("${ordersystem.api.url}") String ordersystemBaseUrl) {
        this.restTemplate = restTemplate;
        this.ordersystemBaseUrl = ordersystemBaseUrl;
    }

    public List<Product> getAllProducts() {
        ResponseEntity<List<Product>> response = restTemplate.exchange(
            ordersystemBaseUrl + PRODUCTS_ENDPOINT,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<>() {}
        );
        return response.getBody();
    }

    public Product getProductById(Long id) {
        return restTemplate.getForObject(ordersystemBaseUrl + PRODUCTS_ENDPOINT + "/{id}", Product.class, id);
    }
}
