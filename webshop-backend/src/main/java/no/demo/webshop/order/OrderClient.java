package no.demo.webshop.order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
/**
 * Client for interacting with the external Order System's Order API.
 * In a real application the integration would map from a bespoke API response class to a product object.
 * Here we just use the product object since class is never called when running fakes. It is the class we fake...
 */
@Service
public class OrderClient {

    private static final Logger logger = LoggerFactory.getLogger(OrderClient.class);
    private static final String ORDERS_ENDPOINT = "/api/orders";

    private final RestTemplate restTemplate;
    private final String ordersystemBaseUrl;

    public OrderClient(RestTemplate restTemplate,
            @Value("${ordersystem.api.url}") String ordersystemBaseUrl) {
        this.restTemplate = restTemplate;
        this.ordersystemBaseUrl = ordersystemBaseUrl;
    }


    public PurchaseOrder getOrderById(Long id) {
        PurchaseOrder order = restTemplate.getForObject(ordersystemBaseUrl + ORDERS_ENDPOINT + "/{id}",
                PurchaseOrder.class, id);
        if (order == null) {
            logger.warn("Order with ID {} not found in ordersystem", id);
        }
        return order;
    }

    public PurchaseOrder createOrder(PurchaseOrder order) {
        return restTemplate.postForObject(ordersystemBaseUrl + ORDERS_ENDPOINT, order, PurchaseOrder.class);
    }

}
