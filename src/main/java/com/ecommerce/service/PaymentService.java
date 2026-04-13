package com.ecommerce.service;

import com.ecommerce.dto.response.PaymentResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Payment;
import com.ecommerce.exception.PaymentException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Transactional
    public PaymentResponse createPaymentIntent(String userEmail, Long orderId, String currency) {
        Order order = orderService.findById(orderId);
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to pay for this order");
        }

        try {
            long amountInCents = order.getTotalAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue();
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency != null ? currency : "usd")
                    .putMetadata("orderId", orderId.toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Payment payment = Payment.builder()
                    .order(order)
                    .stripePaymentIntentId(intent.getId())
                    .amount(order.getTotalAmount())
                    .currency(intent.getCurrency())
                    .status(Payment.PaymentStatus.PENDING)
                    .build();

            Payment saved = paymentRepository.save(payment);

            return PaymentResponse.builder()
                    .id(saved.getId())
                    .stripePaymentIntentId(intent.getId())
                    .amount(saved.getAmount())
                    .currency(saved.getCurrency())
                    .status(saved.getStatus().name())
                    .clientSecret(intent.getClientSecret())
                    .createdAt(saved.getCreatedAt())
                    .build();

        } catch (StripeException e) {
            log.error("Stripe payment intent creation failed: {}", e.getMessage());
            throw new PaymentException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            log.info("Received Stripe webhook event: {}", event.getType());

            if ("payment_intent.succeeded".equals(event.getType())) {
                event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                    if (obj instanceof PaymentIntent intent) {
                        paymentRepository.findByStripePaymentIntentId(intent.getId())
                                .ifPresent(payment -> {
                                    payment.setStatus(Payment.PaymentStatus.COMPLETED);
                                    paymentRepository.save(payment);
                                    orderService.updateOrderStatus(payment.getOrder().getId(), "CONFIRMED");
                                });
                    }
                });
            } else if ("payment_intent.payment_failed".equals(event.getType())) {
                event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                    if (obj instanceof PaymentIntent intent) {
                        paymentRepository.findByStripePaymentIntentId(intent.getId())
                                .ifPresent(payment -> {
                                    payment.setStatus(Payment.PaymentStatus.FAILED);
                                    paymentRepository.save(payment);
                                });
                    }
                });
            }
        } catch (Exception e) {
            log.error("Webhook handling error: {}", e.getMessage());
            throw new PaymentException("Webhook handling failed: " + e.getMessage());
        }
    }
}
