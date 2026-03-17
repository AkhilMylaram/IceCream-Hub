FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
COPY src src
RUN sh ./gradlew build -x test

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
