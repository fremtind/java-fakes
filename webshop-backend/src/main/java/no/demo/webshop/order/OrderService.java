package no.demo.webshop.order;

import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderClient orderClient;

    // Constructor injection - no @Autowired needed with single constructor
    public OrderService(OrderClient orderClient) {
        this.orderClient = orderClient;
    }

    public PurchaseOrder getOrderById(Long id) {
        return orderClient.getOrderById(id);
    }

    public PurchaseOrder createOrder(PurchaseOrder order) {
        return orderClient.createOrder(order);
    }

}
