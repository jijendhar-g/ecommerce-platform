package com.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String stripePaymentIntentId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime createdAt;
    private String clientSecret;
}
