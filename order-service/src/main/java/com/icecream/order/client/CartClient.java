package com.icecream.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "cart-service", url = "${CART_SERVICE_URL:http://cart-service:8084}")
public interface CartClient {
    @GetMapping("/api/cart/{userId}")
    CartDto getCart(@PathVariable("userId") Long userId);
    
    @DeleteMapping("/api/cart/{userId}")
    void clearCart(@PathVariable("userId") Long userId);
}
