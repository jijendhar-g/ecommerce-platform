package com.ecommerce.dto.response;

public record AuthResponse(
    String token,
    String type,
    String email,
    String role
) {
    public AuthResponse(String token, String email, String role) {
        this(token, "Bearer", email, role);
    }
}
