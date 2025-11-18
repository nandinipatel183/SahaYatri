package com.practice.controller;

import com.practice.config.JwtUtil;
import com.practice.model.FoundPerson;
import com.practice.model.LostPerson;
import com.practice.repository.FoundPersonRepository;
import com.practice.repository.LostPersonRepository;
import com.practice.sevice.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class PersonController {

    @Autowired private FoundPersonRepository foundReportRepo;
    @Autowired private LostPersonRepository lostReportRepo;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private MatchingService matchingService;
    @Autowired private LostPersonMatchService lostPersonMatchService;
    @Autowired private JwtUtil jwtUtil;

    private String getEmailFromAuthHeader(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) return null;
        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) return null;
        return jwtUtil.extractEmail(token);
    }

    // FOUND PERSON
    @PostMapping(value = "/found", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FoundPerson> createFoundReport(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam(required = false) String approxAge,
            @RequestParam(required = false) String gender,
            @RequestParam String foundLocation,
            @RequestParam String foundTime,
            @RequestParam(required = false) String description,
            @RequestParam String clothingDescription,
            @RequestParam(required = false) String languages,
            @RequestParam String reporterName,
            @RequestParam String reporterPhone,
            @RequestPart(required = false) MultipartFile photo,
            @RequestPart(required = false) MultipartFile voiceRecording
    ) throws Exception {

        String email = getEmailFromAuthHeader(auth);

        FoundPerson report = new FoundPerson();
        report.setApproxAge(approxAge);
        report.setGender(gender);
        report.setFoundLocation(foundLocation);
        report.setFoundTime(LocalDateTime.parse(foundTime));
        report.setDescription(description);
        report.setClothingDescription(clothingDescription);
        report.setLanguages(languages);
        report.setReporterName(reporterName);
        report.setReporterPhone(reporterPhone);
        report.setUserEmail(email);

        if (photo != null && !photo.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(photo, "sahayatri/found/photos");
            report.setPhotoUrls(imageUrl);
        }

        if (voiceRecording != null && !voiceRecording.isEmpty()) {
            String voiceUrl = cloudinaryService.uploadFile(voiceRecording, "sahayatri/found/voices");
            report.setVoiceRecordingUrl(voiceUrl);
        }

        FoundPerson saved = foundReportRepo.save(report);

        List<LostPerson> allLost = lostReportRepo.findAll();
        for (LostPerson l : allLost) {
            matchingService.attemptMatch(l, saved);
        }

        return ResponseEntity.ok(saved);
    }

    // LOST PERSON
    @PostMapping(value = "/lost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LostPerson> createLostReport(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam String name,
            @RequestParam String age,
            @RequestParam String gender,
            @RequestParam String lastSeenLocation,
            @RequestParam String lastSeenTime,
            @RequestParam(required = false) String description,
            @RequestParam String contactPerson,
            @RequestParam String contactPhone,
            @RequestParam String clothingDescription,
            @RequestParam(required = false) String medicalConditions,
            @RequestParam(required = false) String languages,
            @RequestPart(required = false) MultipartFile photo,
            @RequestPart(required = false) MultipartFile voiceRecording
    ) {

        try {
            String email = getEmailFromAuthHeader(auth);

            LostPerson report = new LostPerson();
            report.setName(name);
            report.setAge(age);
            report.setGender(gender);
            report.setLastSeenLocation(lastSeenLocation);
            report.setLastSeenTime(LocalDateTime.parse(lastSeenTime));
            report.setDescription(description);
            report.setContactPerson(contactPerson);
            report.setContactPhone(contactPhone);
            report.setClothingDescription(clothingDescription);
            report.setMedicalConditions(medicalConditions);
            report.setLanguages(languages);
            report.setUserEmail(email);

            if (photo != null && !photo.isEmpty()) {
                String imageUrl = cloudinaryService.uploadFile(photo, "sahayatri/lost/photos");
                report.setPhotoUrls(imageUrl);
            }

            if (voiceRecording != null && !voiceRecording.isEmpty()) {
                String voiceUrl = cloudinaryService.uploadFile(voiceRecording, "sahayatri/lost/voices");
                report.setVoiceRecordingUrl(voiceUrl);
            }

            LostPerson saved = lostReportRepo.save(report);

            List<FoundPerson> allFound = foundReportRepo.findAll();
            for (FoundPerson f : allFound) {
                matchingService.attemptMatch(saved, f);
            }

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/found")
    public ResponseEntity<List<FoundPerson>> getAllFoundReports() {
        return ResponseEntity.ok(foundReportRepo.findAll());
    }

    @GetMapping("/lost")
    public ResponseEntity<List<LostPerson>> getAllLostReports() {
        return ResponseEntity.ok(lostReportRepo.findAll());
    }

    @PostMapping("/match-lost-person")
    public ResponseEntity<?> matchLostPerson(@RequestParam("image") MultipartFile webcamImage) {
        return lostPersonMatchService.matchLostPerson(webcamImage);
    }
}
