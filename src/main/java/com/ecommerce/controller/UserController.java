package com.ecommerce.controller;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.request.UpdateProfileRequest;
import com.ecommerce.dto.response.AddressResponse;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", userService.getProfile(userDetails.getUsername())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(userDetails.getUsername(), request)));
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get user addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", userService.getAddresses(userDetails.getUsername())));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add a new address")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddressRequest request) {
        AddressResponse response = userService.addAddress(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Address added", response));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        userService.deleteAddress(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }
}
