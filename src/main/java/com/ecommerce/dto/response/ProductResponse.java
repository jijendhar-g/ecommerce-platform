package com.ecommerce.dto.response;

import com.ecommerce.entity.Product;

import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String name,
    String description,
    BigDecimal price,
    Integer stockQuantity,
    String imageUrl,
    String categoryName,
    Long categoryId,
    Double rating,
    Integer reviewCount,
    boolean active
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStockQuantity(),
            product.getImageUrl(),
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getCategory() != null ? product.getCategory().getId() : null,
            product.getRating(),
            product.getReviewCount(),
            product.isActive()
        );
    }
}
