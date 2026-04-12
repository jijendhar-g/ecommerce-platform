package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;

public record OrderRequest(
    @NotBlank String shippingAddress
) {}
