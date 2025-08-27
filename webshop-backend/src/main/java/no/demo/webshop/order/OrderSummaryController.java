package no.demo.webshop.order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for order summary operations.
 * Provides endpoints for retrieving confirmed order details.
 */
@RestController
@RequestMapping("/api/order-summary")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderSummaryController {

    private static final Logger logger = LoggerFactory.getLogger(OrderSummaryController.class);

    private final OrderService orderService;

    // Constructor injection - no @Autowired needed with single constructor
    public OrderSummaryController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Retrieves order summary details by order ID.
     * 
     * @param orderId the ID of the order to retrieve
     * @return ResponseEntity containing the order details or error response
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderSummary(@PathVariable Long orderId) {
        logger.info("Received request to get order summary for order ID: {}", orderId);
        
        try {
            // Call the ordersystem to get order details
            PurchaseOrder orderDetails = orderService.getOrderById(orderId);
            
            logger.info("Successfully retrieved order summary for order ID: {}", orderId);
            return ResponseEntity.ok(orderDetails);
            
        } catch (Exception e) {
            logger.error("Failed to retrieve order summary for order ID: {}", orderId, e);
            
            // Check if it's a not found error (you may need to adjust this based on your error handling)
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.internalServerError()
                .body("Failed to retrieve order summary: " + e.getMessage());
        }
    }
}
