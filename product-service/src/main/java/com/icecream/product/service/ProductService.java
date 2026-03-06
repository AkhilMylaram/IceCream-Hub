package com.icecream.product.service;

import com.icecream.product.model.Category;
import com.icecream.product.model.Product;
import com.icecream.product.repository.CategoryRepository;
import com.icecream.product.repository.ProductRepository;
import com.icecream.product.controller.dto.ProductRequest;
import com.icecream.product.controller.dto.CategoryRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.micrometer.core.instrument.MeterRegistry;

@Service
public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MeterRegistry meterRegistry;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, MeterRegistry meterRegistry) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.meterRegistry = meterRegistry;
    }

    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        return productRepository.findAll();
    }

    public Product getProduct(Long id) {
        log.info("Fetching product {}", id);
        return productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    public List<Product> searchProducts(String name) {
        log.info("Searching products by name: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public Product addProduct(ProductRequest req) {
        log.info("Adding new product: {}", req.name());
        Product product = new Product();
        updateProductFields(product, req);
        meterRegistry.counter("products.added").increment();
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest req) {
        log.info("Updating product {}", id);
        Product product = getProduct(id);
        updateProductFields(product, req);
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product {}", id);
        productRepository.deleteById(id);
    }
    
    @Transactional
    public Category addCategory(CategoryRequest req) {
        log.info("Adding category: {}", req.name());
        Category category = new Category();
        category.setName(req.name());
        return categoryRepository.save(category);
    }
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    private void updateProductFields(Product product, ProductRequest req) {
        product.setName(req.name());
        product.setDescription(req.description());
        product.setFlavor(req.flavor());
        product.setPrice(req.price());
        product.setImageUrl(req.imageUrl());
        if (req.categoryId() != null) {
            Category cat = categoryRepository.findById(req.categoryId()).orElseThrow(() -> new IllegalArgumentException("Category not found"));
            product.setCategory(cat);
        } else {
            product.setCategory(null);
        }
    }
}
