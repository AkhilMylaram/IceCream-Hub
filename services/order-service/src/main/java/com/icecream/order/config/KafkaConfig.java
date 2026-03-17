package com.icecream.order.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class KafkaConfig {
    private static final Logger log = LoggerFactory.getLogger(KafkaConfig.class);

    @Bean
    public NewTopic orderPlacedTopic() {
        log.info("Configuring Kafka Topic: order-placed");
        return TopicBuilder.name("order-placed")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
