package com.icecream.order.controller;

import com.icecream.order.model.Order;
import com.icecream.order.controller.dto.OrderRequest;
import com.icecream.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.createOrder(req.userId()));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }
}
