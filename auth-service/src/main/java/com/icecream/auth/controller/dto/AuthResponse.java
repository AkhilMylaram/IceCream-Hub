package com.icecream.auth.controller.dto;

public record AuthResponse(String token, Long userId, String name) {}
