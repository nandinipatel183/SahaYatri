package com.practice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LostPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String age;
    private String gender;
    private String lastSeenLocation;
    private LocalDateTime lastSeenTime;
    private String description;
    private String clothingDescription;
    private String medicalConditions;
    private String languages;
    private String contactPerson;
    private String contactPhone;
    private String photoUrls;

    private String voiceRecordingUrl;
    private String userEmail;

}
