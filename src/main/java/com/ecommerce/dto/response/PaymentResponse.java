package com.ecommerce.dto.response;

import com.ecommerce.entity.Payment;

import java.math.BigDecimal;

public record PaymentResponse(
    Long id,
    Long orderId,
    String stripePaymentIntentId,
    BigDecimal amount,
    String currency,
    String status
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getOrder().getId(),
            payment.getStripePaymentIntentId(),
            payment.getAmount(),
            payment.getCurrency(),
            payment.getStatus().name()
        );
    }
}
