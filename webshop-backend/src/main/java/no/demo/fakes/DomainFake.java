
package no.demo.fakes;

/**
 * Interface for fakes that implements a product app. Domain Fakes
 * need to have explicit setter and getter for automatic registration of fakes
 *
 */
public interface DomainFake {

    void setScenarioRequest(ScenarioRequest request);

    void setScenarioConfigurations(ScenarioConfigurations configurations);
}
