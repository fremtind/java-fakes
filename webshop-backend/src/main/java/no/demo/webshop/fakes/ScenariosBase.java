package no.demo.webshop.fakes;

import no.demo.fakes.ScenarioConfigurations;
import no.demo.fakes.ScenarioContext;
import no.demo.webshop.customer.Customer;
import no.demo.webshop.product.Product;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@Profile("e2e")
public abstract class ScenariosBase {

    protected final ScenarioConfigurations scenarioConfigurations;

    // Constructor injection - no @Autowired needed with single constructor
    public ScenariosBase(ScenarioConfigurations scenarioConfigurations) {
        this.scenarioConfigurations = scenarioConfigurations;
    }

    @PostConstruct
    public void init() {
        setupScenarios();
    }

    /**
     * Abstract method to be implemented by subclasses to define their specific scenarios
     */
    protected abstract void setupScenarios();

    /**
     * Creates a product with the specified parameters
     */
    protected Product createProduct(Long id, String name, Double price) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setPrice(price);
        return product;
    }

    /**
     * Creates a customer with the specified parameters
     */
    protected Customer createCustomer(Long id, String name, String email) {
        Customer customer = new Customer();
        customer.setId(id);
        customer.setName(name);
        customer.setEmail(email);
        return customer;
    }

    /**
     * Creates a new scenario context and registers it
     */
    protected ScenarioContext createAndRegisterScenario(String scenarioId) {
        ScenarioContext scenarioContext = new ScenarioContext(scenarioId);
        scenarioConfigurations.addScenarioContext(scenarioId, scenarioContext);
        return scenarioContext;
    }

    /**
     * Helper method to add a product to a scenario context
     */
    protected void addProductToScenario(ScenarioContext scenarioContext, String productKey,
                                      Long id, String name, Double price) {
        Product product = createProduct(id, name, price);
        scenarioContext.addProduct(productKey, product);
    }

    /**
     * Helper method to add a customer to a scenario context
     */
    protected void addCustomerToScenario(ScenarioContext scenarioContext, Long id, String name, String email) {
        Customer customer = createCustomer(id, name, email);
        scenarioContext.addCustomer(String.valueOf(id), customer);
    }
}
