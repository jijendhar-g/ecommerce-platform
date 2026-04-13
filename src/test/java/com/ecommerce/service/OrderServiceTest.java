package com.ecommerce.service;

import com.ecommerce.entity.*;
import com.ecommerce.exception.ValidationException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private AddressRepository addressRepository;
    @Mock
    private UserService userService;
    @Mock
    private ProductService productService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Cart emptyCart;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("john@example.com")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of("ROLE_CUSTOMER"))
                .enabled(true)
                .build();

        emptyCart = Cart.builder()
                .id(1L)
                .user(testUser)
                .build();
    }

    @Test
    void createOrder_shouldThrowException_whenCartIsEmpty() {
        when(userService.findUserByEmail("john@example.com")).thenReturn(testUser);
        when(cartRepository.findByUserEmail("john@example.com")).thenReturn(Optional.of(emptyCart));

        assertThatThrownBy(() -> orderService.createOrder("john@example.com", 1L))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Cart is empty");
    }

    @Test
    void createOrder_shouldThrowException_whenCartNotFound() {
        when(userService.findUserByEmail("john@example.com")).thenReturn(testUser);
        when(cartRepository.findByUserEmail("john@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.createOrder("john@example.com", 1L))
                .isInstanceOf(ValidationException.class);
    }
}
