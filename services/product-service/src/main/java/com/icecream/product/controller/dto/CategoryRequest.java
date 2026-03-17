package com.icecream.product.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(@NotBlank String name) {}
