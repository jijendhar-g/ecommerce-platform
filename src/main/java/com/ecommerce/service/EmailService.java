package com.ecommerce.service;

import com.ecommerce.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(String to, Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Order Confirmation - #" + order.getId());
            message.setText(String.format(
                "Thank you for your order!\n\nOrder ID: %d\nTotal: $%.2f\nStatus: %s\n\nWe'll notify you when your order ships.",
                order.getId(), order.getTotalAmount(), order.getStatus()
            ));
            mailSender.send(message);
            log.info("Order confirmation email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    public void sendOrderStatusUpdate(String to, Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Order Status Update - #" + order.getId());
            message.setText(String.format(
                "Your order #%d status has been updated to: %s",
                order.getId(), order.getStatus()
            ));
            mailSender.send(message);
            log.info("Order status update email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send status update email: {}", e.getMessage());
        }
    }
}
