package com.icecream.order.client;
import java.util.List;
public record CartDto(Long user_id, List<CartItemDto> items, Double total_price) {}
