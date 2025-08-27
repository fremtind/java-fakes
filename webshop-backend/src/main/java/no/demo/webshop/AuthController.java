package no.demo.webshop;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    @GetMapping
    public String loginPage() {
        return "Login page";
    }

    @PostMapping
    public String login(@RequestParam String email) {
        // In a real application, you would validate credentials here
        // For this demo, we'll just return the email as a simple response
        return "Logged in as: " + email;
    }
}
