package com.icecream.order.service;

public record OrderItemEvent(
    Long productId,
    String productName,
    Double price,
    Integer quantity
) {}
