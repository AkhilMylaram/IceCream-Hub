package com.icecream.product.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProductRequest(
    @NotBlank String name,
    String description,
    String flavor,
    @NotNull @Positive Double price,
    String imageUrl,
    Long categoryId
) {}
