package com.practice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long lostItemId;
    private Long foundItemId;

    private double similarity;

    private String matchedLostImage;
    private String matchedFoundImage;

    private boolean notified;
}
