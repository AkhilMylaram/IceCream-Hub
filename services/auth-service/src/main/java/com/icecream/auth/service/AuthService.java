package com.icecream.auth.service;

import com.icecream.auth.model.Session;
import com.icecream.auth.model.User;
import com.icecream.auth.repository.SessionRepository;
import com.icecream.auth.repository.UserRepository;
import com.icecream.auth.controller.dto.RegisterRequest;
import com.icecream.auth.controller.dto.LoginRequest;
import com.icecream.auth.controller.dto.AuthResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final MeterRegistry meterRegistry;

    public AuthService(UserRepository userRepository, SessionRepository sessionRepository, MeterRegistry meterRegistry) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.meterRegistry = meterRegistry;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        log.info("Registering new user with email: {}", req.email());
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        
        User user = new User();
        user.setEmail(req.email());
        user.setPassword(hashPassword(req.password()));
        user.setName(req.name());
        user.setAddress(req.address());
        user = userRepository.save(user);
        
        meterRegistry.counter("users.registered").increment();
        
        return createSession(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        log.info("User login attempt for email: {}", req.email());
        
        return userRepository.findByEmail(req.email())
            .map(user -> {
                if (!user.getPassword().equals(hashPassword(req.password()))) {
                    throw new IllegalArgumentException("Invalid credentials");
                }
                meterRegistry.counter("users.logged_in").increment();
                return createSession(user);
            })
            .orElseGet(() -> {
                log.info("User not found, auto-registering: {}", req.email());
                String defaultName = req.email().split("@")[0];
                // RegisterRequest field order: (email, password, name, address)
                RegisterRequest regReq = new RegisterRequest(req.email(), req.password(), defaultName, "Default Address");
                return register(regReq);
            });
    }

    private AuthResponse createSession(User user) {
        String token = UUID.randomUUID().toString();
        Session session = new Session();
        session.setUserId(user.getId());
        session.setToken(token);
        session.setExpiresAt(LocalDateTime.now().plusHours(24));
        sessionRepository.save(session);
        log.info("Created session for user: {}", user.getId());
        // Include email in response so the frontend can display it in the profile dropdown
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @Transactional
    public void logout(String token) {
        log.info("User logout for token");
        sessionRepository.deleteByToken(token);
    }
}
