package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
    @NotNull Long orderId,
    String currency
) {}
