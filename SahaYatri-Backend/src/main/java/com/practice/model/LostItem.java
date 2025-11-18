package com.practice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;
    private String brand;
    private String color;
    private String size;
    private String uniqueFeatures;
    private String lastSeenLocation;
    private LocalDateTime lastSeenTime;
    private String description;
    private String contactPerson;
    private String contactPhone;
    private Double estimatedValue;
    private LocalDate purchaseDate;
    private String photoPaths;
    private String userEmail;

}
