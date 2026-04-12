package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartItemResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.exception.ValidationException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;

    public CartResponse getCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(String userEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productService.findById(request.getProductId());

        if (!product.isActive()) {
            throw new ValidationException("Product is not available");
        }
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new ValidationException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setPrice(product.getPrice());
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateCartItem(String userEmail, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new UnauthorizedException("Cart item does not belong to this user");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeFromCart(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new UnauthorizedException("Cart item does not belong to this user");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public BigDecimal getCartTotal(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        return cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Cart getOrCreateCart(String userEmail) {
        return cartRepository.findByUserEmail(userEmail).orElseGet(() -> {
            User user = userService.findUserByEmail(userEmail);
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private CartResponse mapToResponse(Cart cart) {
        var items = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .product(productService.mapToResponse(item.getProduct()))
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .total(total)
                .itemCount(items.size())
                .build();
    }
}
