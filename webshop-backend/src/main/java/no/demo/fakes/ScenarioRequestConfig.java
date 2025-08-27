package no.demo.fakes;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.context.annotation.RequestScope;
import jakarta.servlet.http.Cookie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Translates the e2e-cookie into ScenarioRequest bean
 */
@Profile("e2e")
@Configuration
public class ScenarioRequestConfig {
    private static final Logger logger = LoggerFactory.getLogger(ScenarioRequestConfig.class);
    public static final String E2E_COOKIE = "e2e-test-scenario";

    @Bean
    @RequestScope
    public ScenarioRequest scenarioBean(HttpServletRequest request) {
        ScenarioRequest scenarioRequest = new ScenarioRequest();
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (E2E_COOKIE.equals(cookie.getName())) {
                    logger.info("Found e2e-test-scenario cookie with value: {}", cookie.getValue());
                    scenarioRequest.setScenarioID(cookie.getValue());
                    break;
                }
            }
        }
        return scenarioRequest;
    }
}
