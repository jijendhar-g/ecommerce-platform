package com.ecommerce.controller;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.service.CartService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void getCart_shouldReturn200_whenAuthenticated() throws Exception {
        CartResponse cartResponse = CartResponse.builder()
                .id(1L)
                .items(Collections.emptyList())
                .total(BigDecimal.ZERO)
                .build();

        when(cartService.getCart("john@example.com")).thenReturn(cartResponse);

        mockMvc.perform(get("/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void getCart_shouldReturn403_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/cart"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void addToCart_shouldReturn200_whenValidRequest() throws Exception {
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        CartResponse cartResponse = CartResponse.builder()
                .id(1L)
                .items(Collections.emptyList())
                .total(BigDecimal.valueOf(19.99))
                .build();

        when(cartService.addToCart(eq("john@example.com"), any(CartItemRequest.class))).thenReturn(cartResponse);

        mockMvc.perform(post("/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void clearCart_shouldReturn200_whenAuthenticated() throws Exception {
        mockMvc.perform(delete("/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
