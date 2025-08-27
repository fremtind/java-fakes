package no.demo.webshop.order;

import no.demo.webshop.product.ProductService;
import no.demo.webshop.customer.CustomerService;
import no.demo.webshop.customer.Customer;
import no.demo.webshop.shoppingcart.ShoppingCart;
import no.demo.webshop.shoppingcart.ShoppingCartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@RestController
@RequestMapping("/api/orders")
public class OrderProcessingController {

    private static final Logger logger = LogManager.getLogger(OrderProcessingController.class);

    private final ShoppingCartService shoppingCartService;
    private final CustomerService customerService;
    private final OrderService orderService;
    private final ProductService productService;

    // Constructor injection - no @Autowired needed with single constructor
    public OrderProcessingController(ShoppingCartService shoppingCartService,
                                   CustomerService customerService,
                                   OrderService orderService,
                                   ProductService productService) {
        this.shoppingCartService = shoppingCartService;
        this.customerService = customerService;
        this.orderService = orderService;
        this.productService = productService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<PurchaseOrder> confirmOrder(@RequestParam Long cartId, @RequestParam String userEmail) {
        ShoppingCart cart = shoppingCartService.getCartById(cartId);
        if (cart == null || !cart.getUserEmail().equals(userEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Get or create customer
            Customer customer = customerService.getCustomerByEmail(userEmail);
            if (customer == null) {
                customer = new Customer();
                customer.setEmail(userEmail);
                customer = customerService.createCustomer(customer);
            }

            // Create order lines
            List<OrderLine> orderLines = new ArrayList<>();
            for (ShoppingCart.CartProduct cartProduct : cart.getProducts()) {
                OrderLine orderLine = new OrderLine();
                orderLine.setProduct(productService.getProductById(cartProduct.getProductId()));
                orderLine.setQuantity(cartProduct.getQuantity());
                orderLine.setPrice(cartProduct.getPrice());
                orderLines.add(orderLine);
            }

            // Create purchase order
            PurchaseOrder order = new PurchaseOrder();
            order.setCustomer(customer);
            order.setOrderDate(LocalDateTime.now());
            order.setTotalAmount(cart.getTotalAmount());
            order.setStatus("CONFIRMED");
            order.setOrderLines(orderLines);

            // Save order via ordersystem
            PurchaseOrder createdOrder = orderService.createOrder(order);

            // Clear cart after successful order
            shoppingCartService.clearCart(cartId);

            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            // Log the error and return a 500 status with error message
            logger.error(String.format("Error processing order for cartId: %s and userEmail: %s", String.valueOf(cartId), userEmail), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
