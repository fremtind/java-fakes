package no.demo.webshop.fakes;

import no.demo.webshop.product.Product;
import no.demo.webshop.product.ProductClient;
import no.demo.fakes.ScenarioConfigurations;
import no.demo.fakes.ScenarioContext;
import no.demo.fakes.ScenarioRequest;
import no.demo.fakes.DomainFake;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductClientFake extends ProductClient implements DomainFake {

    private ScenarioRequest scenarioRequest;
    private ScenarioConfigurations scenarioConfigurations;

    public ProductClientFake() {
        super(null, null);
    }

    @Override
    public void setScenarioRequest(ScenarioRequest scenarioRequest) {
        this.scenarioRequest = scenarioRequest;
    }

    @Override
    public void setScenarioConfigurations(ScenarioConfigurations scenarioConfigurations) {
        this.scenarioConfigurations = scenarioConfigurations;
    }

    @Override
    public List<Product> getAllProducts() {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Return products from scenario context
            return scenarioContext.getProducts().values().stream().toList();
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }

    @Override
    public Product getProductById(Long id) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Return product from scenario context
            return scenarioContext.getProduct(String.valueOf(id));
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }


}



