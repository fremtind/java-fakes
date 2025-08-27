package no.demo.webshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"no.demo.webshop", "no.demo.fakes"})

public class WebshopApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebshopApplication.class, args);
    }
}
