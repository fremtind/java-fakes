## Overview
This repository implements the test Fake pattern using Spring AOP to intercept service method calls during testing and redirect them to fake implementations.

Code is heavily based on Fremtind internal implementation of Fakes presented in the talk "Bruk av Fakes - The good the bad and the Ugly" at JavaZone 2025. 
It is not a framework and will (probably) not be maintained after initial commit. It is under MIT license and free to use as inspiration for your own implementation.

The implementation of the Fakes shows:

- **Scenario-based testing**: Predefined test data scenarios that can be selected per test
- **Service interception**: Automatic redirection from real services to fakes using Spring AOP
- **Clean production code**: No test-specific annotations or modifications needed in production services
- **Playwright integration**: Seamless integration with frontend e2e tests via HTTP cookies

### Core Components

#### 1. FakeableAspect
The heart of the framework that intercepts all calls to `@Service` annotated classes:

```java
@Around("within(@org.springframework.stereotype.Service *)")
public Object doFakeImplementation(ProceedingJoinPoint joinPoint)
```

- Uses reflection to find matching fake implementations
- Automatically routes service calls to fakes when available
- Supports exception scenarios for error testing
- Only active when `e2e` profile is enabled

#### 2. DomainFake Interface
All fake implementations must implement this interface:

```java
public interface DomainFake {
    void setScenarioRequest(ScenarioRequest request);
    void setScenarioConfigurations(ScenarioConfigurations configurations);
}
```

#### 3. ScenarioContext
Holds test data for a specific scenario:

```java
public class ScenarioContext {
    private final Map<String, Customer> customers;
    private final Map<String, Product> products;
    private final Map<String, PurchaseOrder> orders;
    private final Map<Class<?>, RuntimeException> exceptionToThrow;
}
```

#### 4. FakeRepository
Manages all registered fakes and provides them to the aspect:

- Auto-discovers all beans implementing `DomainFake`
- Injects scenario configuration into each fake
- Maintains the registry of available fakes

## Creating Fakes

### 1. Extend the Original Service
Fake classes extend the original service class and implement `DomainFake`:

```java
@Component
public class ProductClientFake extends ProductClient implements DomainFake {
    
    private ScenarioRequest scenarioRequest;
    private ScenarioConfigurations scenarioConfigurations;

    public ProductClientFake() {
        super(null, null); // Bypass original constructor
    }

    @Override
    public List<Product> getAllProducts() {
        ScenarioContext context = scenarioConfigurations
            .getScenarioContext(scenarioRequest.getScenarioID());
        return context.getProducts().values().stream().toList();
    }
}
```

### 2. Define Scenario Data
Create scenarios by extending `ScenariosBase`:

```java
@Component
@Profile("e2e")
public class WebshopScenarios extends ScenariosBase {
    
    @Override
    protected void setupScenarios() {
        ScenarioContext context = createAndRegisterScenario("e2e-flow");
        addCustomerToScenario(context, 1L, "Test Customer", "test@example.com");
        addProductToScenario(context, "1", 1L, "Test Product 1", 100.0);
        addProductToScenario(context, "2", 2L, "Test Product 2", 200.0);
    }
}
```

### 4. Exception Testing
Fakes can be configured to throw exceptions for testing error scenarios:

```java
// In scenario setup
scenarioContext.addException(ProductClient.class, 
    new RuntimeException("Product service unavailable"));
```

## Playwright Integration

### Scenario Selection via Cookies
Tests specify which scenario to use through HTTP cookies:

```typescript
// Set scenario cookie before each test
await page.context().addCookies([{
    name: 'e2e-test-scenario',
    value: 'e2e-flow',
    domain: 'localhost',
    path: '/',
}]);
```

### Test Fixtures
The framework provides reusable test fixtures that automatically set scenario cookies:

```typescript
export function createTestWithScenario(scenarioId: string) {
    return base.extend<WebshopFixtures>({
        loginPage: async ({ page }, use) => {
            await page.context().addCookies([{
                name: TestData.SCENARIO.COOKIE_NAME,
                value: scenarioId,
                // ...cookie config
            }]);
            await use(new LoginPage(page));
        },
    });
}
```

### Example Test
```typescript
const test = createTestWithScenario('e2e-flow');

test('should complete full shopping journey', async ({ 
    loginPage, shopPage, checkoutPage, orderSummaryPage 
}) => {
    await loginPage.login(TestData.USER.EMAIL);
    expect(await shopPage.isProductVisible(TestData.PRODUCTS.PRODUCT_1)).toBe(true);
    
    await shopPage.addProductToCart(TestData.PRODUCTS.PRODUCT_1);
    await shopPage.proceedToCheckout();
    await checkoutPage.confirmOrder();
    await orderSummaryPage.verifyOrderConfirmation();
});
```


## Running the Demo

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+

### Start E2E Tests
```bash
cd webshop-frontend
npm run e2e
```

This command will:
1. Start the Spring Boot backend with the `e2e` profile
2. Wait for the backend to be healthy
3. Run all Playwright tests
4. Use the fake framework for deterministic test data

### Manual Backend Start
```bash
cd webshop-backend
mvn spring-boot:run -Dspring-boot.run.profiles=e2e
```

## Framework Features

### Automatic Fake Discovery
The `FakeRepository` automatically discovers all beans implementing `DomainFake` at startup and registers them for use by the aspect.

### Reflection-Based Method Matching
The framework uses reflection to match method signatures between original services and fakes, ensuring type safety and proper method resolution.

### Profile-Based Activation
All fake-related components are only active when the `e2e` Spring profile is enabled, ensuring they don't interfere with production deployments.

### Scenario Reset
A REST endpoint is provided to reset all scenario data between test runs:
```
GET /scenario/reset
```

## Demo Application Note
The webshop application (frontend and backend) serves purely as a demonstration vehicle for the fake framework. The business logic is intentionally simple to keep focus on the fake implementation patterns and testing strategies.
