package no.demo.fakes;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scenario")
@Profile("e2e")
public class ResetContextController {
    private final ResetContextService scenarioService;

    public ResetContextController(ResetContextService scenarioService) {
        this.scenarioService = scenarioService;
    }

    @GetMapping("/reset")
    public void resetAllScenarios() {
        scenarioService.resetAllScenarios();
    }
}
