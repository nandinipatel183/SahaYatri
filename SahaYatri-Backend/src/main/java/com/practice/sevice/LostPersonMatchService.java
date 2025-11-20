package com.practice.sevice;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.practice.model.LostPerson;
import com.practice.model.Match;
import com.practice.repository.LostPersonRepository;
import com.practice.repository.MatchRepository;

@Service
public class LostPersonMatchService {

    @Autowired
    private LostPersonRepository repo;

    @Autowired
    private MatchRepository matchRepo;

    @Autowired
    private SmsService smsService;

    public ResponseEntity<?> matchLostPerson(MultipartFile webcamImage) {
        try {
            // 1️⃣ Save temporary image
            File tempFile = File.createTempFile("webcam_", ".jpg");
            webcamImage.transferTo(tempFile);
            System.out.println("TEMP PATH = " + tempFile.getAbsolutePath());

            // 2️⃣ Load all lost persons
            List<LostPerson> lostList = repo.findAll();
            List<String> urls = lostList.stream()
                    .map(LostPerson::getPhotoUrls)
                    .toList();

            if (urls.isEmpty()) {
                return ResponseEntity.ok("❌ No Lost Person Records Found");
            }

            // 3️⃣ Run Python script
            ProcessBuilder pb = new ProcessBuilder(
                    "C:\\Users\\parid\\Desktop\\SahaYatri\\CCTV-Detection\\.venv\\Scripts\\python.exe",
                    "face_match.py",
                    "--webcam", tempFile.getAbsolutePath(),
                    "--urls", String.join(",", urls)
            );

            pb.directory(new File("C:\\Users\\parid\\Desktop\\SahaYatri\\CCTV-Detection"));
            pb.redirectErrorStream(true);

            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String pythonOutput = reader.readLine();
            System.out.println("PYTHON OUTPUT = " + pythonOutput);

            if (pythonOutput == null || pythonOutput.equals("NO_MATCH")) {
                return ResponseEntity.ok("❌ No Match Found");
            }

            // 4️⃣ Extract file name from python result
            String pythonFile = pythonOutput.substring(pythonOutput.lastIndexOf("/") + 1).trim();

            // 5️⃣ Find matching LostPerson entry
            LostPerson matched = lostList.stream()
                    .filter(lp -> lp.getPhotoUrls() != null &&
                            Arrays.stream(lp.getPhotoUrls().split(","))
                                    .map(String::trim)
                                    .anyMatch(url -> url.contains(pythonFile)))
                    .findFirst()
                    .orElse(null);

            if (matched == null) {
                return ResponseEntity.ok("⚠ Match detected but no DB record matched.");
            }

            // 6️⃣ Save into match table
            Match match = new Match();
            match.setLostId(matched.getId());
            match.setFoundId(null); // CCTV found → no foundPersonId
            match.setConfidence(100.0);
            match.setMatchedAt(java.time.LocalDateTime.now());
            matchRepo.save(match);

            // 7️⃣ Delete the matched lost person
            repo.deleteById(matched.getId());
            System.out.println("LostPerson removed after CCTV match: ID" + matched.getId());

            // 8️⃣ Send SMS
            smsService.sendCustomSMS(
                    matched.getContactPhone(),
                    "CCTV MATCH FOUND!\nPerson identified: " + matched.getName() +"Locaton: Cam-ID:26432 near Mahakal Temple Gate-3"
            );

            return ResponseEntity.ok("Match Found! SMS Sent. Record Removed from Lost-Person table.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error: " + e.getMessage());
        }
    }
}
