package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Cart testCart;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .role(Role.ROLE_CUSTOMER)
                .build();

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .price(new BigDecimal("50.00"))
                .stockQuantity(10)
                .build();

        CartItem cartItem = CartItem.builder()
                .id(1L)
                .product(testProduct)
                .quantity(2)
                .build();

        testCart = Cart.builder()
                .id(1L)
                .user(testUser)
                .items(new ArrayList<>(List.of(cartItem)))
                .build();

        cartItem.setCart(testCart);
    }

    @Test
    void createOrder_WithValidCart_ShouldCreateOrder() {
        OrderRequest request = new OrderRequest("123 Main St, City, State 12345");
        Order savedOrder = Order.builder()
                .id(1L)
                .user(testUser)
                .status(Order.Status.PENDING)
                .totalAmount(new BigDecimal("100.00"))
                .shippingAddress(request.shippingAddress())
                .items(new ArrayList<>())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);
        doNothing().when(emailService).sendOrderConfirmation(anyString(), any(Order.class));

        OrderResponse result = orderService.createOrder(1L, request);

        assertThat(result).isNotNull();
        assertThat(result.status()).isEqualTo("PENDING");
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_WithEmptyCart_ShouldThrowException() {
        testCart.getItems().clear();
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(testCart));

        assertThatThrownBy(() -> orderService.createOrder(1L, new OrderRequest("123 Main St")))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("empty");
    }
}
