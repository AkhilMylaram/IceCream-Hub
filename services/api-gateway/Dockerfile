FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
COPY src src
RUN sh ./gradlew build -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
