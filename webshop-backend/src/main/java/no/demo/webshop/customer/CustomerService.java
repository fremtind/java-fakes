package no.demo.webshop.customer;

import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerClient customerClient;

    // Constructor injection - no @Autowired needed with single constructor
    public CustomerService(CustomerClient customerClient) {
        this.customerClient = customerClient;
    }

    public Customer getCustomerByEmail(String email) {
        return customerClient.getCustomerByEmail(email);
    }

    public Customer createCustomer(Customer customer) {
        return customerClient.createCustomer(customer);
    }
}
