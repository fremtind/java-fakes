package no.demo.webshop.shoppingcart;

import no.demo.webshop.product.ProductService;
import no.demo.webshop.product.Product;
import no.demo.webshop.shoppingcart.ShoppingCart.CartProduct;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final ProductService productService;

    // Constructor injection - no @Autowired needed with single constructor
    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository, ProductService productService) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.productService = productService;
    }

    public ShoppingCart createCart(String userEmail) {
        ShoppingCart cart = new ShoppingCart();
        cart.setUserEmail(userEmail);
        return shoppingCartRepository.save(cart);
    }

    public ShoppingCart getCartById(Long cartId) {
        return shoppingCartRepository.findById(cartId).orElse(null);
    }

    public ShoppingCart addProductToCart(Long cartId, Long productId, Integer quantity) {
        ShoppingCart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        Product product = productService.getProductById(productId);
        if (product == null) {
            return null;
        }

        CartProduct cartProduct = new CartProduct();
        cartProduct.setProductId(product.getId());
        cartProduct.setProductName(product.getName());
        cartProduct.setPrice(product.getPrice());
        cartProduct.setQuantity(quantity);

        List<CartProduct> products = cart.getProducts();
        boolean productExists = false;

        for (CartProduct existingProduct : products) {
            if (existingProduct.getProductId().equals(productId)) {
                existingProduct.setQuantity(existingProduct.getQuantity() + quantity);
                productExists = true;
                break;
            }
        }

        if (!productExists) {
            products.add(cartProduct);
        }

        // Update total amount
        double newTotal = 0.0;
        for (CartProduct p : products) {
            newTotal += p.getPrice() * p.getQuantity();
        }
        cart.setTotalAmount(newTotal);

        return shoppingCartRepository.save(cart);
    }

    public ShoppingCart removeProductFromCart(Long cartId, Long productId) {
        ShoppingCart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        List<CartProduct> products = cart.getProducts();
        products.removeIf(p -> p.getProductId().equals(productId));

        // Update total amount
        double newTotal = 0.0;
        for (CartProduct p : products) {
            newTotal += p.getPrice() * p.getQuantity();
        }
        cart.setTotalAmount(newTotal);

        return shoppingCartRepository.save(cart);
    }

    public ShoppingCart updateProductQuantity(Long cartId, Long productId, Integer quantity) {
        ShoppingCart cart = getCartById(cartId);
        if (cart == null) {
            return null;
        }

        List<CartProduct> products = cart.getProducts();
        for (CartProduct p : products) {
            if (p.getProductId().equals(productId)) {
                p.setQuantity(quantity);
                break;
            }
        }

        // Update total amount
        double newTotal = 0.0;
        for (CartProduct p : products) {
            newTotal += p.getPrice() * p.getQuantity();
        }
        cart.setTotalAmount(newTotal);

        return shoppingCartRepository.save(cart);
    }

    public void clearCart(Long cartId) {
        ShoppingCart cart = getCartById(cartId);
        if (cart != null) {
            cart.getProducts().clear();
            cart.setTotalAmount(0.0);
            shoppingCartRepository.save(cart);
        }
    }

    public void deleteCart(Long cartId) {
        shoppingCartRepository.deleteById(cartId);
    }
}
