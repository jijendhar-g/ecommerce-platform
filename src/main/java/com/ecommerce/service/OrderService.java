package com.ecommerce.service;

import com.ecommerce.dto.response.OrderItemResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.exception.ValidationException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserService userService;
    private final ProductService productService;
    private final EmailService emailService;

    @Transactional
    public OrderResponse createOrder(String userEmail, Long addressId) {
        User user = userService.findUserByEmail(userEmail);
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ValidationException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new ValidationException("Cart is empty");
        }

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        if (!address.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("Address does not belong to this user");
        }

        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .status(Order.OrderStatus.PENDING)
                .totalAmount(total)
                .shippingAddress(address)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new ValidationException("Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productService.findById(product.getId());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        emailService.sendOrderConfirmation(savedOrder);

        return mapToResponse(savedOrder);
    }

    public Page<OrderResponse> getUserOrders(String userEmail, Pageable pageable) {
        return orderRepository.findByUserEmail(userEmail, pageable).map(this::mapToResponse);
    }

    public OrderResponse getOrderById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = findById(id);
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid order status: " + status);
        }
        Order saved = orderRepository.save(order);
        if (Order.OrderStatus.SHIPPED.equals(saved.getStatus())) {
            emailService.sendShippingUpdate(saved);
        }
        return mapToResponse(saved);
    }

    @Transactional
    public OrderResponse cancelOrder(String userEmail, Long orderId) {
        Order order = findById(orderId);
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }
        if (Order.OrderStatus.SHIPPED.equals(order.getStatus()) ||
            Order.OrderStatus.DELIVERED.equals(order.getStatus())) {
            throw new ValidationException("Cannot cancel order in status: " + order.getStatus());
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
        }
        return mapToResponse(orderRepository.save(order));
    }

    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    public OrderResponse mapToResponse(Order order) {
        var items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .product(productService.mapToResponse(item.getProduct()))
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .user(userService.mapToUserResponse(order.getUser()))
                .items(items)
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress() != null
                        ? userService.mapToAddressResponse(order.getShippingAddress()) : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
