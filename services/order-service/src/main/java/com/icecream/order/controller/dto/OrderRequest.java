package com.icecream.order.controller.dto;

import jakarta.validation.constraints.NotNull;

public record OrderRequest(@NotNull Long userId) {}
