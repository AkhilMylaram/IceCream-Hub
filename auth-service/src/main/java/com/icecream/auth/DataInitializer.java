package com.icecream.auth;

import com.icecream.auth.model.User;
import com.icecream.auth.service.AuthService;
import com.icecream.auth.controller.dto.RegisterRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.icecream.auth.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    
    private final AuthService authService;
    private final UserRepository userRepository;

    public DataInitializer(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking for default admin user...");
        if (userRepository.findByEmail("admin").isEmpty()) {
            log.info("Admin user not found. Initializing default admin user.");
            RegisterRequest adminReq = new RegisterRequest(
                "Admin User",
                "admin",
                "admin",
                "Headquarters"
            );
            authService.register(adminReq);
            log.info("Default admin user created successfully.");
        } else {
            log.info("Admin user already exists.");
        }
    }
}
