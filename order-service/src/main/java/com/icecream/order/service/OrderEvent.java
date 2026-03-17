package com.icecream.order.service;

import java.util.List;

public record OrderEvent(
    Long orderId,
    Long userId,
    Double totalAmount,
    List<OrderItemEvent> items
) {}
