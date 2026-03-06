package com.icecream.order.service;

import com.icecream.order.model.Order;
import com.icecream.order.model.OrderItem;
import com.icecream.order.repository.OrderRepository;
import com.icecream.order.client.ProductClient;
import com.icecream.order.client.CartClient;
import com.icecream.order.client.CartDto;
import com.icecream.order.client.ProductDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final CartClient cartClient;
    private final MeterRegistry meterRegistry;

    public OrderService(OrderRepository orderRepository, ProductClient productClient, CartClient cartClient, MeterRegistry meterRegistry) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.cartClient = cartClient;
        this.meterRegistry = meterRegistry;
    }

    @Transactional
    public Order createOrder(Long userId) {
        log.info("Creating order for user: {}", userId);
        
        CartDto cart = cartClient.getCart(userId);
        if (cart == null || cart.items() == null || cart.items().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("CREATED");
        double total = 0.0;
        
        for (var cartItem : cart.items()) {
            ProductDto product = productClient.getProduct(cartItem.product_id());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.id());
            orderItem.setProductName(product.name());
            orderItem.setPrice(product.price());
            orderItem.setQuantity(cartItem.quantity());
            
            order.addItem(orderItem);
            total += (product.price() * cartItem.quantity());
        }
        
        order.setTotalAmount(total);
        order = orderRepository.save(order);
        
        cartClient.clearCart(userId);
        
        meterRegistry.counter("orders_created_total").increment();
        
        log.info("Order created successfully with ID: {}", order.getId());
        return order;
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
