package no.demo.fakes;

import jakarta.annotation.PostConstruct;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Hold testdata and configuration for running fakes in the backend. Fakes are
 * shared between
 * scenarios and are used to mock responses from external services.
 * <p>
 * Class is responsible for selecting the correct fake based on the request and
 * fake configuration. The fakes
 * will be hydrated with test data coming from ScenarioContext. Repository will
 * also throw configured
 * scenarios exceptions if needed.
 *
 * @see ScenarioRequest
 * @see ScenarioConfigurations
 */
@Profile("e2e")
@Component
public class FakeRepository {
    public final List<DomainFake> domainFakes = new ArrayList<>();

    private final ApplicationContext applicationContext;
    private final ScenarioRequest scenarioRequest;
    private final ScenarioConfigurations scenarioConfigurations;

    public List<DomainFake> getDomainFakes() {
        return domainFakes;
    }

    // Constructor injection - no @Autowired needed with single constructor
    public FakeRepository(ApplicationContext applicationContext, ScenarioRequest scenarioRequest, ScenarioConfigurations scenarioConfigurations) {
        this.applicationContext = applicationContext;
        this.scenarioRequest = scenarioRequest;
        this.scenarioConfigurations = scenarioConfigurations;
    }

    @PostConstruct
    public void registerFakes() {
        // Find all beans that implement DomainFake
        String[] beanNames = applicationContext.getBeanNamesForType(DomainFake.class);
        for (String beanName : beanNames) {
            DomainFake fake = applicationContext.getBean(beanName, DomainFake.class);
            fake.setScenarioRequest(scenarioRequest);
            fake.setScenarioConfigurations(scenarioConfigurations);
            domainFakes.add(fake);
        }
    }
}
