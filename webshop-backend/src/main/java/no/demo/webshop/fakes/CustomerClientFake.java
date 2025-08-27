package no.demo.webshop.fakes;

import no.demo.fakes.DomainFake;
import no.demo.fakes.ScenarioConfigurations;
import no.demo.fakes.ScenarioContext;
import no.demo.fakes.ScenarioRequest;
import no.demo.webshop.customer.Customer;
import no.demo.webshop.customer.CustomerClient;
import org.springframework.stereotype.Component;

@Component
public class CustomerClientFake extends CustomerClient implements DomainFake {

    private ScenarioRequest scenarioRequest;
    private ScenarioConfigurations scenarioConfigurations;

    public CustomerClientFake() {
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
    public Customer getCustomerByEmail(String email) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Return customer from scenario context
            return scenarioContext.getCustomers().values().stream()
                    .filter(customer -> customer.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }

    @Override
    public Customer createCustomer(Customer customer) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Add customer to scenario context
            scenarioContext.addCustomer(String.valueOf(customer.getId()), customer);
            return customer;
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }

}
