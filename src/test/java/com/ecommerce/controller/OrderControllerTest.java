package com.ecommerce.controller;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void createOrder_shouldReturn201_whenValidRequest() throws Exception {
        OrderRequest request = new OrderRequest();
        request.setAddressId(1L);

        OrderResponse orderResponse = OrderResponse.builder()
                .id(1L)
                .status("PENDING")
                .totalAmount(BigDecimal.valueOf(99.99))
                .build();

        when(orderService.createOrder("john@example.com", 1L)).thenReturn(orderResponse);

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void getUserOrders_shouldReturn200_withOrderList() throws Exception {
        OrderResponse orderResponse = OrderResponse.builder()
                .id(1L)
                .status("PENDING")
                .totalAmount(BigDecimal.valueOf(99.99))
                .build();

        Page<OrderResponse> page = new PageImpl<>(List.of(orderResponse));
        when(orderService.getUserOrders(eq("john@example.com"), any())).thenReturn(page);

        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(username = "john@example.com", roles = "CUSTOMER")
    void getOrderById_shouldReturn404_whenNotFound() throws Exception {
        when(orderService.getOrderById(99L)).thenThrow(new ResourceNotFoundException("Order not found"));

        mockMvc.perform(get("/orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createOrder_shouldReturn403_whenNotAuthenticated() throws Exception {
        OrderRequest request = new OrderRequest();
        request.setAddressId(1L);

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
