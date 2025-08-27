package no.demo.webshop.fakes;

import no.demo.fakes.DomainFake;
import no.demo.fakes.ScenarioConfigurations;
import no.demo.fakes.ScenarioContext;
import no.demo.fakes.ScenarioRequest;
import no.demo.webshop.order.OrderClient;
import no.demo.webshop.order.OrderLine;
import no.demo.webshop.order.PurchaseOrder;
import org.springframework.stereotype.Component;

@Component
public class OrderClientFake extends OrderClient implements DomainFake {

    private ScenarioRequest scenarioRequest;
    private ScenarioConfigurations scenarioConfigurations;

    public OrderClientFake() {
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
    public PurchaseOrder getOrderById(Long id) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Return order from scenario context
            return scenarioContext.getOrder(String.valueOf(id));
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }

    @Override
    public PurchaseOrder createOrder(PurchaseOrder order) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Incremental ID generation based on existing orders context + 1
            long newId = scenarioContext.getOrders().keySet().stream()
                    .mapToLong(Long::parseLong)
                    .max()
                    .orElse(0L) + 1;

            // Set the order ID
            order.setId(newId);

            // Generate IDs for order lines
            if (order.getOrderLines() != null) {
                long orderLineIdCounter = 1;
                for (OrderLine orderLine : order.getOrderLines()) {
                    orderLine.setId(orderLineIdCounter++);
                }
            }

            scenarioContext.addOrder(String.valueOf(newId), order);
            return order;
        }
        throw new IllegalStateException(
                "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
    }

    // Not used, but kept to demonstrate how update can work
    public void updateOrder(Long id, PurchaseOrder order) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Update order in scenario context
            scenarioContext.addOrder(String.valueOf(id), order);
        } else {
            throw new IllegalStateException(
                    "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
        }
    }

    // Not used, but kept to demonstrate how delete can work
    public void deleteOrder(Long id) {
        ScenarioContext scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());
        if (scenarioContext != null) {
            // Remove order from scenario context
            scenarioContext.getOrders().remove(String.valueOf(id));
        } else {
            throw new IllegalStateException(
                    "No scenario context available for scenario ID: " + scenarioRequest.getScenarioID());
        }
    }
}
