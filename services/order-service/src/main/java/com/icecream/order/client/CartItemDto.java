package com.icecream.order.client;
public record CartItemDto(Long product_id, String name, Double price, Integer quantity) {}
