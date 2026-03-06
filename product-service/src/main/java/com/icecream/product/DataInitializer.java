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
        log.info("Checking for default catalog data...");
        if (productRepository.count() == 0) {
            log.info("Catalog is empty. Initializing default products.");
            
            Category premium = new Category();
            premium.setName("Premium");
            premium.setDescription("Our most luxurious and stunning ice cream flavors.");
            premium = categoryRepository.save(premium);
            
            Category finalPremium = premium;
            
            List<Product> products = Arrays.asList(
                createProduct("Salted Caramel Glow", "Rich caramel with sea salt crystals.", "Caramel", 5.99, "/images/salted_caramel.png", finalPremium),
                createProduct("Midnight Brownie", "Dark chocolate with chewy brownie pieces.", "Chocolate", 6.49, "/images/midnight_chocolate.png", finalPremium),
                createProduct("Pistachio Dream", "Premium roasted pistachios in creamy base.", "Pistachio", 6.99, "/images/pistachio.png", finalPremium),
                createProduct("Strawberry Velvet", "Fresh strawberries with velvet cake chunks.", "Strawberry", 5.49, "/images/strawberry_shortcake.png", finalPremium),
                createProduct("Espresso Gold", "Double-shot espresso infused cream.", "Coffee", 5.99, "/images/espresso.png", finalPremium),
                createProduct("Coconut Bliss", "Tropical coconut milk and shredded coconut.", "Coconut", 5.49, "/images/coconut.png", finalPremium),
                createProduct("Oreo Chunk", "Classic cookies and cream with extra chunks.", "Cookies & Cream", 5.99, "/images/cookies_cream.png", finalPremium),
                createProduct("Mango Tango", "Zesty alfonso mango sorbet.", "Mango", 4.99, "/images/mango.png", finalPremium),
                createProduct("Cool Mint Flake", "Refreshing mint with dark chocolate curls.", "Mint", 5.49, "/images/mint.png", finalPremium),
                createProduct("Honey Lavender", "Artisanal honey with organic lavender notes.", "Lavender", 6.49, "/images/honey_lavender.png", finalPremium)
            );
            
            productRepository.saveAll(products);
            log.info("Successfully seeded 10 artisanal products.");
        } else {
            log.info("Catalog already contains data. Skipping seed.");
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
