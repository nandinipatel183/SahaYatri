package com.practice.controller;

import com.practice.config.JwtUtil;
import com.practice.model.FoundItem;
import com.practice.model.LostItem;
import com.practice.repository.FoundItemRepository;
import com.practice.repository.LostItemRepository;
import com.practice.sevice.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    @Autowired
    private LostItemRepository lostItemRepo;

    @Autowired
    private FoundItemRepository foundItemRepo;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ItemMatchService itemMatchService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getEmailFromAuthHeader(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) return null;
        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) return null;
        return jwtUtil.extractEmail(token);
    }

    // CREATE LOST ITEM
    @PostMapping(value = "/lost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLostItem(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam String itemName,
            @RequestParam String category,
            @RequestParam(required = false) String brand,
            @RequestParam String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String uniqueFeatures,
            @RequestParam String lastSeenLocation,
            @RequestParam String lastSeenTime,
            @RequestParam(required = false) String description,
            @RequestParam String contactPerson,
            @RequestParam String contactPhone,
            @RequestParam(required = false) Double estimatedValue,
            @RequestParam(required = false) String purchaseDate,
            @RequestPart(required = false) MultipartFile photo
    ) {
        try {
            String email = getEmailFromAuthHeader(auth);

            LostItem item = new LostItem();
            item.setItemName(itemName);
            item.setCategory(category);
            item.setBrand(brand);
            item.setColor(color);
            item.setSize(size);
            item.setUniqueFeatures(uniqueFeatures);
            item.setLastSeenLocation(lastSeenLocation);
            item.setDescription(description);
            item.setContactPerson(contactPerson);
            item.setContactPhone(contactPhone);
            item.setEstimatedValue(estimatedValue);

            item.setUserEmail(email);

            try {
                item.setLastSeenTime(LocalDateTime.parse(lastSeenTime));
            } catch (Exception ignored) {}

            if (purchaseDate != null && !purchaseDate.isBlank()) {
                try { item.setPurchaseDate(LocalDate.parse(purchaseDate)); }
                catch (Exception ignored) {}
            }

            if (photo != null && !photo.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(photo, "sahayatri/items/lost");
                item.setPhotoPaths(imageUrl);
            }

            LostItem saved = lostItemRepo.save(item);
            itemMatchService.matchItemsForLost(saved);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save lost item");
        }
    }

    // CREATE FOUND ITEM
    @PostMapping(value = "/found", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createFoundItem(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam String itemName,
            @RequestParam String category,
            @RequestParam(required = false) String brand,
            @RequestParam String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String uniqueFeatures,
            @RequestParam String foundLocation,
            @RequestParam String foundTime,
            @RequestParam(required = false) String description,
            @RequestParam String contactPerson,
            @RequestParam String contactPhone,
            @RequestPart(required = false) MultipartFile photo
    ) {
        try {
            String email = getEmailFromAuthHeader(auth);

            FoundItem item = new FoundItem();
            item.setItemName(itemName);
            item.setCategory(category);
            item.setBrand(brand);
            item.setColor(color);
            item.setSize(size);
            item.setUniqueFeatures(uniqueFeatures);
            item.setFoundLocation(foundLocation);
            item.setDescription(description);
            item.setContactPerson(contactPerson);
            item.setContactPhone(contactPhone);
            item.setUserEmail(email);

            try {
                item.setFoundTime(LocalDateTime.parse(foundTime));
            } catch (Exception ignored) {}

            if (photo != null && !photo.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(photo, "sahayatri/items/found");
                item.setPhotoUrl(imageUrl);
            }

            FoundItem saved = foundItemRepo.save(item);
            itemMatchService.matchItemsForFound(saved);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save found item");
        }
    }

    @GetMapping("/lost")
    public ResponseEntity<List<LostItem>> getAllLostItems() {
        return ResponseEntity.ok(lostItemRepo.findAll());
    }

    @GetMapping("/found")
    public ResponseEntity<List<FoundItem>> getAllFoundItems() {
        return ResponseEntity.ok(foundItemRepo.findAll());
    }
}
