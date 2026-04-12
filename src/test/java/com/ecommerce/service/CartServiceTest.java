package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.ValidationException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private UserService userService;
    @Mock
    private ProductService productService;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Product testProduct;
    private Cart testCart;

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

        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .price(new BigDecimal("10.00"))
                .stockQuantity(50)
                .sku("TEST-001")
                .active(true)
                .averageRating(0.0)
                .build();

        testCart = Cart.builder()
                .id(1L)
                .user(testUser)
                .build();
    }

    @Test
    void getCart_shouldCreateNewCart_whenNoneExists() {
        when(cartRepository.findByUserEmail("john@example.com")).thenReturn(Optional.empty());
        when(userService.findUserByEmail("john@example.com")).thenReturn(testUser);
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        CartResponse response = cartService.getCart("john@example.com");

        assertThat(response).isNotNull();
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void addToCart_shouldThrowException_whenInsufficientStock() {
        testProduct.setStockQuantity(2);
        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(10);

        when(cartRepository.findByUserEmail("john@example.com")).thenReturn(Optional.of(testCart));
        when(productService.findById(1L)).thenReturn(testProduct);

        assertThatThrownBy(() -> cartService.addToCart("john@example.com", request))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Insufficient stock");
    }
}
