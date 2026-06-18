package com.paperbank.config;

import com.paperbank.model.Role;
import com.paperbank.model.User;
import com.paperbank.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("admin@paperbank.com")) {
            User admin = User.builder()
                    .email("admin@paperbank.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Paper Bank Admin")
                    .role(Role.ROLE_ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@paperbank.com / admin123");
        }
    }
}
