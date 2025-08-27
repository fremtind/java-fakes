package no.demo.fakes;

import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ScenarioConfigurations {
    private final Map<String, ScenarioContext> scenarioContexts = new HashMap<>();

    public ScenarioContext getScenarioContext(String scenarioId) {
        return scenarioContexts.get(scenarioId);
    }

    public void addScenarioContext(String scenarioId, ScenarioContext scenarioContext) {
        scenarioContexts.put(scenarioId, scenarioContext);
    }

    public void resetScenarioContext() {
        scenarioContexts.clear();
    }

}
