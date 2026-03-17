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
import org.springframework.kafka.core.KafkaTemplate;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final CartClient cartClient;
    private final MeterRegistry meterRegistry;
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public OrderService(OrderRepository orderRepository, ProductClient productClient, CartClient cartClient, MeterRegistry meterRegistry, KafkaTemplate<String, OrderEvent> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.cartClient = cartClient;
        this.meterRegistry = meterRegistry;
        this.kafkaTemplate = kafkaTemplate;
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
        
        // --- KAFKA INTEGRATION START ---
        final Order savedOrder = order;
        List<OrderItemEvent> itemEvents = order.getItems().stream()
            .map(item -> new OrderItemEvent(item.getProductId(), item.getProductName(), item.getPrice(), item.getQuantity()))
            .collect(Collectors.toList());
        
        OrderEvent orderEvent = new OrderEvent(savedOrder.getId(), savedOrder.getUserId(), savedOrder.getTotalAmount(), itemEvents);
        
        log.info("Emitting Kafka Order Event: {}", orderEvent);
        kafkaTemplate.send("order-placed", orderEvent.orderId().toString(), orderEvent)
            .whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Kafka Event sent successfully for order: {}", orderEvent.orderId());
                } else {
                    log.error("Failed to send Kafka Event for order: {}", orderEvent.orderId(), ex);
                }
            });
        // --- KAFKA_INTEGRATION_END ---

        cartClient.clearCart(userId);
        
        meterRegistry.counter("orders_created_total").increment();
        
        log.info("Order created successfully with ID: {}", order.getId());
        return order;
    }
    
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
