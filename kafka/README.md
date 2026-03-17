# 🎡 IceCream Hub — Kafka Service

This directory contains the configuration and build context for the **Apache Kafka** event streaming platform.

## Role
Kafka acts as the central nervous system for the IceCream Hub, enabling **event-driven** communication between:
- **Order Service**: Publishes `order-placed` events.
- **Recommendation Service**: Consumes events to update real-time analytics.

## Configuration
The service is currently configured to run in **KRaft mode** (no Zookeeper required). The configuration is primarily managed via environment variables in `docker-compose.yml` for development flexibility, while the `Dockerfile` provides a hook for future custom plugins or security configurations.

## 📊 Viewing Data
You can view the event stream and data in two ways:

### 1. Web Interface (Recommended)
Open your browser to: **[http://localhost:8090](http://localhost:8090)**
- **Topics**: Click on the `order-placed` topic to see current messages.
- **Messages**: You can view the JSON payload of every order placed.
- **Monitoring**: Visualize consumer groups (like `recommendation-group`) and their offsets.

### 2. Command Line (CLI)
Run this command to stream new events directly to your terminal:
```bash
docker exec -it icecream-kafka /opt/kafka/bin/kafka-console-consumer.sh --topic order-placed --from-beginning --bootstrap-server localhost:9092
```

---
**Status**: Integrated (v4.2 - Event Driven)
