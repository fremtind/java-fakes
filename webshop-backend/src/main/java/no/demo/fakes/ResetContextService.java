package no.demo.fakes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;

import java.lang.reflect.Constructor;
import java.util.Arrays;
import java.util.List;

@Service
public class ResetContextService {
    private static final Logger logger = LoggerFactory.getLogger(ResetContextService.class);

    private final ApplicationContext applicationContext;
    private final ScenarioConfigurations scenarioConfigurations;

    // Constructor injection - no @Autowired needed with single constructor
    public ResetContextService(ApplicationContext applicationContext,
            ScenarioConfigurations scenarioConfigurations) {
        this.applicationContext = applicationContext;
        this.scenarioConfigurations = scenarioConfigurations;
    }

    public void resetAllScenarios() {
        reinitializeAllScenarios();
    }

    public void reinitializeAllScenarios() {
        if (!(applicationContext instanceof ConfigurableApplicationContext configurableContext)) {
            throw new IllegalStateException(
                    "ApplicationContext must be ConfigurableApplicationContext to reinitialize beans");
        }

        ConfigurableListableBeanFactory beanFactory = configurableContext.getBeanFactory();

        // Reset scenario configurations
        scenarioConfigurations.resetScenarioContext();

        // Find all beans containing "Scenarios" in their name
        List<String> scenarioBeans = Arrays.stream(applicationContext.getBeanDefinitionNames())
                .filter(name -> name.contains("Scenarios")).toList();

        // Reinitialize each scenario bean
        for (String beanName : scenarioBeans) {
            try {
                logger.info("Resetting scenario {}", beanName);
                Object bean = applicationContext.getBean(beanName);
                Class<?> beanClass = bean.getClass();

                // Clear mother class (ScenarioConfigurations)
                Constructor<?> constructor = beanClass.getConstructor(ScenarioConfigurations.class);
                Object newBean = constructor.newInstance(scenarioConfigurations);

                // Need to use DefaultListableBeanFactory to destroy singleton
                if (beanFactory instanceof DefaultListableBeanFactory) {
                    ((DefaultListableBeanFactory) beanFactory).destroySingleton(beanName);
                }
                beanFactory.registerSingleton(beanName, newBean);

            } catch (Exception e) {
                throw new RuntimeException("Failed to reinitialize scenario bean: " + beanName, e);
            }
        }
    }
}
