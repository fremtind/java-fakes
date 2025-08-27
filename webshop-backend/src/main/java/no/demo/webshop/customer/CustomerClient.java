package no.demo.webshop.customer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Client for interacting with the external Order System's Customer API.
 * In a real application the integration would map from a bespoke API response class to a product object.
 * Here we just use the product object since class is never called when running fakes. It is the class we fake...
 */
@Service
public class CustomerClient {

    private static final String CUSTOMERS_ENDPOINT = "/api/customers";

    private final RestTemplate restTemplate;
    private final String ordersystemBaseUrl;

    public CustomerClient(RestTemplate restTemplate,
            @Value("${ordersystem.api.url}") String ordersystemBaseUrl) {
        this.restTemplate = restTemplate;
        this.ordersystemBaseUrl = ordersystemBaseUrl;
    }

    public Customer getCustomerByEmail(String email) {
        try {
            return restTemplate.getForObject(ordersystemBaseUrl + CUSTOMERS_ENDPOINT + "/email/{email}", Customer.class,
                    email);
        } catch (Exception e) {
            // Handle the case where the customer doesn't exist
            return null;
        }
    }

    public Customer createCustomer(Customer customer) {
        return restTemplate.postForObject(ordersystemBaseUrl + CUSTOMERS_ENDPOINT, customer, Customer.class);
    }
}
