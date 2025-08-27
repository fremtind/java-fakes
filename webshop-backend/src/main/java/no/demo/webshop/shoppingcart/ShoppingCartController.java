package no.demo.webshop.shoppingcart;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    // Constructor injection - no @Autowired needed with single constructor
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @PostMapping
    public ShoppingCart createCart(@RequestParam String userEmail) {
        return shoppingCartService.createCart(userEmail);
    }

    @GetMapping("/{id}")
    public ShoppingCart getCart(@PathVariable Long id) {
        return shoppingCartService.getCartById(id);
    }

    @PostMapping("/add")
    public ShoppingCart addProductToCart(@RequestParam Long cartId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return shoppingCartService.addProductToCart(cartId, productId, quantity);
    }

    @PostMapping("/remove")
    public ShoppingCart removeProductFromCart(@RequestParam Long cartId,
            @RequestParam Long productId) {
        return shoppingCartService.removeProductFromCart(cartId, productId);
    }

    @PostMapping("/update")
    public ShoppingCart updateProductQuantity(@RequestParam Long cartId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return shoppingCartService.updateProductQuantity(cartId, productId, quantity);
    }

    @PostMapping("/clear")
    public void clearCart(@RequestParam Long cartId) {
        shoppingCartService.clearCart(cartId);
    }

    @DeleteMapping("/{id}")
    public void deleteCart(@PathVariable Long id) {
        shoppingCartService.deleteCart(id);
    }
}
