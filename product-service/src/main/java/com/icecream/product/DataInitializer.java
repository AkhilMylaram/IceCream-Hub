package com.icecream.product;

import com.icecream.product.model.Product;
import com.icecream.product.model.Category;
import com.icecream.product.repository.ProductRepository;
import com.icecream.product.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking for default catalog data (Product count: {})...", productRepository.count());
        if (productRepository.count() == 0) {
            log.info("Catalog is empty. Initializing default premium products for AWS environment.");
            
            try {
                Category premium = new Category();
                premium.setName("Premium");
                premium = categoryRepository.save(premium);
                
                final Category finalPremium = premium;
                
                List<Product> items = Arrays.asList(
                    createProduct("Salted Caramel Glow", "Rich artisanal caramel with Mediterranean sea salt crystals.", "Caramel", 5.99, "/images/salted_caramel.png", finalPremium),
                    createProduct("Midnight Brownie", "Intense dark chocolate with chewy fudge brownie pieces.", "Chocolate", 6.49, "/images/midnight_chocolate.png", finalPremium),
                    createProduct("Pistachio Dream", "Premium roasted Sicilian pistachios in a silky cream base.", "Pistachio", 6.99, "/images/pistachio.png", finalPremium),
                    createProduct("Strawberry Velvet", "Fresh heritage strawberries with organic velvet cake chunks.", "Strawberry", 5.49, "/images/strawberry_shortcake.png", finalPremium),
                    createProduct("Espresso Gold", "Smooth double-shot espresso infused with Madagascar vanilla.", "Coffee", 5.99, "/images/espresso.png", finalPremium),
                    createProduct("Coconut Bliss", "Tropical organic coconut milk with toasted coconut shreds.", "Coconut", 5.49, "/images/coconut.png", finalPremium),
                    createProduct("Oreo Chunk", "Classic cookies and cream featuring hand-broken artisanal wafers.", "Cookies & Cream", 5.99, "/images/cookies_cream.png", finalPremium),
                    createProduct("Mango Tango", "Zesty sun-ripened Alfonso mango sorbet.", "Mango", 4.99, "/images/mango.png", finalPremium),
                    createProduct("Cool Mint Flake", "Refreshing garden mint with 70% dark chocolate curls.", "Mint", 5.49, "/images/mint.png", finalPremium),
                    createProduct("Honey Lavender", "Wildflower honey paired with organic Provencal lavender.", "Lavender", 6.49, "/images/honey_lavender.png", finalPremium)
                );
                
                productRepository.saveAll(items);
                log.info("Successfully seeded {} products into the catalog.", items.size());
            } catch (Exception e) {
                log.error("Failed to seed product data: {}", e.getMessage(), e);
            }
        } else {
            log.info("Catalog already contains {} products. Skipping initialization.", productRepository.count());
        }
    }

    private Product createProduct(String name, String desc, String flavor, Double price, String img, Category cat) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setFlavor(flavor);
        p.setPrice(price);
        p.setImageUrl(img);
        p.setCategory(cat);
        return p;
    }
}
