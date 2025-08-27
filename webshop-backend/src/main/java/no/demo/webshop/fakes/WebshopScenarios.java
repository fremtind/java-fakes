package no.demo.webshop.fakes;

import no.demo.fakes.ScenarioConfigurations;
import no.demo.fakes.ScenarioContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("e2e")
public class WebshopScenarios extends ScenariosBase {

    public WebshopScenarios(ScenarioConfigurations scenarioConfigurations) {
        super(scenarioConfigurations);
    }

    @Override
    protected void setupScenarios() {
        login();
        shoppingCart();
        checkout();
        orderSummary();
        e2eFlow();
    }

    private void login() {
        ScenarioContext scenarioContext = createAndRegisterScenario("login");
        addCustomerToScenario(scenarioContext, 1L, "Test Customer", "test@example.com");
        addProductToScenario(scenarioContext, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(scenarioContext, "2", 2L, "Test Product 2", 200.0);
    }


    private void shoppingCart() {
        ScenarioContext scenarioContext = createAndRegisterScenario("shopping-cart");
        addCustomerToScenario(scenarioContext, 1L, "Test Customer", "test@example.com");
        addProductToScenario(scenarioContext, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(scenarioContext, "2", 2L, "Test Product 2", 200.0);
    }


    private void checkout() {
        ScenarioContext scenarioContext = createAndRegisterScenario("checkout");
        addCustomerToScenario(scenarioContext, 1L, "Test Customer", "test@example.com");
        addProductToScenario(scenarioContext, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(scenarioContext, "2", 2L, "Test Product 2", 200.0);
    }

    private void orderSummary() {
        ScenarioContext scenarioContext = createAndRegisterScenario("order-summary");
        addCustomerToScenario(scenarioContext, 1L, "Test Customer", "test@example.com");
        addProductToScenario(scenarioContext, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(scenarioContext, "2", 2L, "Test Product 2", 200.0);
    }

    private void e2eFlow() {
        ScenarioContext scenarioContext = createAndRegisterScenario("e2e-flow");
        addCustomerToScenario(scenarioContext, 1L, "Test Customer", "test@example.com");
        addProductToScenario(scenarioContext, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(scenarioContext, "2", 2L, "Test Product 2", 200.0);
    }

}
