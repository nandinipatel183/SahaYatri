package com.practice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoundPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String approxAge;
    private String gender;
    private String foundLocation;
    private LocalDateTime foundTime;
    private String description;
    private String clothingDescription;
    private String languages;
    private String reporterName;
    private String reporterPhone;

    private String photoUrls;

    private String voiceRecordingUrl;
    private String userEmail;

}
