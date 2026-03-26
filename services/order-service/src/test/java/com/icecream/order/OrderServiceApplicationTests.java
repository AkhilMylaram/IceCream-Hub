package com.icecream.order;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Disabled for CI: Requires active MySQL/Redis/Kafka services to load context")
class OrderServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
