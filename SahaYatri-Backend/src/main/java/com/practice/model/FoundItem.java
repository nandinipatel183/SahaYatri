package com.practice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class FoundItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String category;
    private String brand;
    private String color;
    private String size;
    private String uniqueFeatures;
    private String foundLocation;
    private LocalDateTime foundTime;
    private String description;
    private String contactPerson;
    private String contactPhone;
    private String photoUrl;
    private String userEmail;

}
