package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOrderConfirmation(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getUser().getEmail());
            message.setSubject("Order Confirmation - Order #" + order.getId());
            message.setText("Your order #" + order.getId() + " has been placed successfully. " +
                    "Total: " + order.getTotalAmount());
            mailSender.send(message);
            log.info("Order confirmation email sent to {}", order.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    public void sendShippingUpdate(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getUser().getEmail());
            message.setSubject("Your Order #" + order.getId() + " Has Shipped!");
            message.setText("Good news! Your order #" + order.getId() + " is on its way.");
            mailSender.send(message);
            log.info("Shipping update email sent to {}", order.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send shipping update email: {}", e.getMessage());
        }
    }

    public void sendPasswordReset(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Password Reset Request");
            message.setText("Use this token to reset your password: " + token +
                    "\nThis token expires in 1 hour.");
            mailSender.send(message);
            log.info("Password reset email sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email: {}", e.getMessage());
        }
    }

    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Welcome to E-Commerce Platform!");
            message.setText("Hello " + user.getFirstName() + ",\n\nWelcome to our platform! " +
                    "We're excited to have you on board.");
            mailSender.send(message);
            log.info("Welcome email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }
}
