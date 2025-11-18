package com.practice.sevice;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.practice.model.LostPerson;
import com.practice.repository.LostPersonRepository;

@Service
public class LostPersonMatchService {

    @Autowired
    private LostPersonRepository repo;

    @Autowired
    private SmsService smsService;

    public ResponseEntity<?> matchLostPerson(MultipartFile webcamImage) {
        try {
            // 1. Save webcam image temporarily
            File tempFile = File.createTempFile("webcam_", ".jpg");
            webcamImage.transferTo(tempFile);

            // 2. Load lost person Cloudinary URLs
            List<LostPerson> lostList = repo.findAll();
            List<String> urls = lostList.stream()
                    .map(LostPerson::getPhotoUrls)
                    .toList();

            // 3. Python command
            ProcessBuilder pb = new ProcessBuilder(
                    "C:\\Users\\parid\\Desktop\\SY\\python-backend\\.venv\\Scripts\\python.exe",
                    "face_match.py",
                    tempFile.getAbsolutePath(),
                    String.join(",", urls)
            );

            pb.directory(new File("C:\\Users\\parid\\Desktop\\SY\\python-backend"));
            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String result = reader.readLine();

            if (result == null || result.equals("NO_MATCH")) {
                return ResponseEntity.ok("❌ No match found");
            }

            // 4. Find lost person by matching filename
            LostPerson matched = lostList.stream()
                    .filter(lp -> lp.getPhotoUrls().contains(result))
                    .findFirst()
                    .orElse(null);

            if (matched != null) {
                // 5. Send SMS
                smsService.sendCustomSMS(
                        matched.getContactPhone(),
                        "📢 MATCH FOUND! Lost person identified: " + matched.getName()
                );

                return ResponseEntity.ok("✅ Match found! SMS sent.");
            }

            return ResponseEntity.ok("⚠ Match found but record missing.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error: " + e.getMessage());
        }
    }
}
