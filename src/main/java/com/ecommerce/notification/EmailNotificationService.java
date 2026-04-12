package com.ecommerce.notification;

import com.ecommerce.entity.Order;
import com.ecommerce.service.EmailService;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private final EmailService emailService;

    public EmailNotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void notifyOrderCreated(String email, Order order) {
        emailService.sendOrderConfirmation(email, order);
    }

    public void notifyOrderStatusChanged(String email, Order order) {
        emailService.sendOrderStatusUpdate(email, order);
    }
}
