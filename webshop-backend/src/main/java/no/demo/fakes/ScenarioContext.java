package no.demo.fakes;

import no.demo.webshop.customer.Customer;
import no.demo.webshop.product.Product;
import no.demo.webshop.order.PurchaseOrder;

import java.util.HashMap;
import java.util.Map;

/**
 * Class holds product state to use by fakes. State is stored in a map with a tag
 * as key. This enables
 * multiple copies of the same product objects to be stored. The product object
 * can be retrieved using a specific tag
 * in the Fake.
 * <p>
 * Errorhandling is implemented so that if Fake tries to retrieve a product
 * object that does not exist,
 * a NoSuchElementException will be given with a message that includes the
 * scenarioId and the tag.
 */
public class ScenarioContext {
    private final String scenarioId;
    private final Map<String, Customer> customers = new HashMap<>();
    private final Map<String, Product> products = new HashMap<>();
    private final Map<String, PurchaseOrder> orders = new HashMap<>();
    private final Map<Class<?>, RuntimeException> exceptionToThrow = new HashMap<>();

    public ScenarioContext(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    public String getScenarioId() {
        return scenarioId;
    }

    public void addCustomer(String id, Customer customer) {
        customers.put(id, customer);
    }

    public Customer getCustomer(String id) {
        return customers.get(id);
    }

    public void addProduct(String id, Product product) {
        products.put(id, product);
    }

    public Product getProduct(String id) {
        return products.get(id);
    }

    public void addOrder(String id, PurchaseOrder order) {
        orders.put(id, order);
    }

    public PurchaseOrder getOrder(String id) {
        return orders.get(id);
    }

    public void addException(Class<?> clazz, RuntimeException e) {
        exceptionToThrow.put(clazz, e);
    }

    public RuntimeException getException(Class<?> clazz) {
        return exceptionToThrow.get(clazz);
    }

    public Map<String, Customer> getCustomers() {
        return customers;
    }

    public Map<String, Product> getProducts() {
        return products;
    }

    public Map<String, PurchaseOrder> getOrders() {
        return orders;
    }
}
