package com.ecommerce.dto.response;

import com.ecommerce.entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long id,
    String status,
    BigDecimal totalAmount,
    String shippingAddress,
    List<OrderItemResponse> items,
    LocalDateTime createdAt
) {
    public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice
    ) {}

    public static OrderResponse from(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
            .map(item -> new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getUnitPrice()
            ))
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getStatus().name(),
            order.getTotalAmount(),
            order.getShippingAddress(),
            itemResponses,
            order.getCreatedAt()
        );
    }
}
