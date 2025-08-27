#!/bin/bash
# Script to kill all running Springboot and npm dev processes, then start all services

echo "Shutting down Springboot processes gracefully..."
# Try to gracefully shutdown via actuator endpoint first
if curl -s -X POST http://localhost:8080/actuator/shutdown > /dev/null 2>&1; then
    echo "Spring Boot application shutdown successfully via actuator"
    sleep 2  # Give the application time to fully shutdown
fi

echo "Starting ordersystem backend..."
# Start ordersystem backend with e2e profile
cd ../webshop-backend && mvn spring-boot:run -Dspring-boot.run.profiles=e2e &

# Health check loop - 3 attempts with 2 second delays
echo "Waiting for Spring Boot application to start..."
sleep 3
for attempt in {1..3}; do
    echo "Attempt $attempt/3: Checking if Spring Boot application is running on port 8080..."

    if curl -s -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✅  Spring Boot application is running successfully on port 8080"
        exit 0
    else
        if [ $attempt -lt 3 ]; then
            echo "⏳ Check failed, waiting 2 seconds before next attempt..."
            sleep 2
        fi
    fi
done

echo "❌ ERROR: Spring Boot application failed to start on port 8080 after 3 attempts"
echo "Please check the application logs for errors"
exit 1
