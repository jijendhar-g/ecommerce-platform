package com.ecommerce.service;

import com.ecommerce.dto.request.ReviewRequest;
import com.ecommerce.dto.response.ReviewResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.exception.ValidationException;
import com.ecommerce.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final ProductService productService;

    @Transactional
    public ReviewResponse addReview(String userEmail, Long productId, ReviewRequest request) {
        User user = userService.findUserByEmail(userEmail);
        Product product = productService.findById(productId);

        reviewRepository.findByProductIdAndUserId(productId, user.getId()).ifPresent(r -> {
            throw new ValidationException("You have already reviewed this product");
        });

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        productService.findById(productId);

        return mapToResponse(saved);
    }

    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable).map(this::mapToResponse);
    }

    @Transactional
    public void deleteReview(String userEmail, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .user(userService.mapToUserResponse(review.getUser()))
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
