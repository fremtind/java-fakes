package no.demo.fakes;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Optional;

/**
 * Aspect that will intercept all calls to services and call a fake if it
 * exists.
 * <p>
 * Service-classes are NOT annotated with an annotation to indicate that a fake
 * should be used. Instead
 * the Fake extends the original app and the aspect will check if a fake is
 * configured in the {@link FakeRepository}
 * for this app. The aspect has some use of reflection. This is slow and
 * somewhat complex, but it is
 * only in this class and it helps to keep the production code clean and easy to
 * read.
 */
@Aspect
@Component
@Profile("e2e")
public class FakeableAspect {

    private final FakeRepository fakeRepository;
    private final ScenarioConfigurations scenarioConfigurations;
    private final ScenarioRequest scenarioRequest;

    // Constructor injection - no @Autowired needed with single constructor
    public FakeableAspect(FakeRepository fakeRepository, ScenarioRequest scenarioRequest,
            ScenarioConfigurations scenarioConfigurations) {
        this.fakeRepository = fakeRepository;
        this.scenarioRequest = scenarioRequest;
        this.scenarioConfigurations = scenarioConfigurations;
    }

    /*
     * Will intercept any call to a class annotated with @Service to see if fake
     * exists for this class.
     *
     */
    @Around("within(@org.springframework.stereotype.Service *)")
    public Object doFakeImplementation(ProceedingJoinPoint joinPoint) throws Throwable { // NOSONAR

        var targetClass = joinPoint.getTarget().getClass();
        var fake = fakeRepository.getDomainFakes().stream()
                .filter(r -> targetClass.isAssignableFrom(r.getClass()))
                .findFirst();

        if (fake.isPresent()) {
            var theFake = fake.get();
            var scenarioContext = scenarioConfigurations.getScenarioContext(scenarioRequest.getScenarioID());

            // Run error scenario if configured
            if (scenarioContext != null && scenarioContext.getException(theFake.getClass()) != null) {
                throw scenarioContext.getException(theFake.getClass());
            }

            return runFakeMethod(joinPoint, theFake);
        } else {
            return joinPoint.proceed();
        }
    }

    private Method findCorrectMethod(Method realMethod, Object fake) {
        Method fakeMethod = null;
        // Need to check both methods and parameters to find which method is called (if
        // overloaded)
        for (Method m : fake.getClass().getMethods()) {
            if (m.getName().equals(realMethod.getName()) &&
                    Arrays.equals(m.getParameterTypes(), realMethod.getParameterTypes())) {
                fakeMethod = m;
                break;
            }
        }

        if (fakeMethod == null) {
            throw new ApplicationException("No matching method found in FakeClass: " + fake.getClass()
                    + " for method: " + realMethod.getName());
        }
        return fakeMethod;
    }

    private Object runFakeMethod(ProceedingJoinPoint joinPoint, Object fake) {
        var method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        try {
            Method fakeMethod = findCorrectMethod(method, fake);

            if (!DomainFake.class.isAssignableFrom(fakeMethod.getDeclaringClass())) {
                throw new ApplicationException("No fake found for app: " + fakeMethod.getDeclaringClass()
                        + " method: " + fakeMethod.getName() + ". Please implemented method in Fake class");
            }

            return fakeMethod.invoke(fake, joinPoint.getArgs());
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            var excpetionMessage = Optional.ofNullable(e.getCause())
                    .map(Throwable::getMessage)
                    .orElseGet(() -> Optional.ofNullable(e.getMessage())
                        .orElse("Unknown error"));

            var rtex = new RuntimeException(excpetionMessage);

            // Create a custom stack trace with the fake class at the top for better error reporting
            var customStackTrace = new StackTraceElement[] {
                new StackTraceElement(
                    fake.getClass().getName(),
                    method.getName(),
                    fake.getClass().getSimpleName() + ".java",
                    0)
            };
            rtex.setStackTrace(customStackTrace);
            throw rtex;

        }
    }
}
