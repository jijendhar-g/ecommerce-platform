package com.ecommerce.service;

import com.ecommerce.dto.request.UpdateProfileRequest;
import com.ecommerce.dto.response.UserResponse;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encoded")
                .roles(Set.of("ROLE_CUSTOMER"))
                .enabled(true)
                .build();
    }

    @Test
    void getProfile_shouldReturnUserResponse_whenUserExists() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        UserResponse response = userService.getProfile("john@example.com");

        assertThat(response.getEmail()).isEqualTo("john@example.com");
        assertThat(response.getFirstName()).isEqualTo("John");
    }

    @Test
    void getProfile_shouldThrowException_whenUserNotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfile("notfound@example.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateProfile_shouldUpdateFields_whenProvided() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFirstName("Jane");
        request.setLastName("Smith");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserResponse response = userService.updateProfile("john@example.com", request);

        verify(userRepository).save(any(User.class));
        assertThat(testUser.getFirstName()).isEqualTo("Jane");
    }
}
