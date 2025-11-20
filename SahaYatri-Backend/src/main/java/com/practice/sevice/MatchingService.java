package com.practice.sevice;

import com.practice.model.FoundPerson;
import com.practice.model.LostPerson;
import com.practice.model.Match;
import com.practice.repository.MatchRepository;
import com.practice.repository.LostPersonRepository;
import com.practice.repository.FoundPersonRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MatchingService {

    private final FaceMatchService faceMatchService;
    private final MatchRepository matchRepository;
    private final SmsService smsService;
    private final LostPersonRepository lostRepo;
    private final FoundPersonRepository foundRepo;

    @Value("${match.confidence.threshold:80.0}")
    private double threshold;

    public MatchingService(
            FaceMatchService faceMatchService,
            MatchRepository matchRepository,
            SmsService smsService,
            LostPersonRepository lostRepo,
            FoundPersonRepository foundRepo
    ) {
        this.faceMatchService = faceMatchService;
        this.matchRepository = matchRepository;
        this.smsService = smsService;
        this.lostRepo = lostRepo;
        this.foundRepo = foundRepo;
    }

   
    @Transactional
    public synchronized boolean attemptMatch(LostPerson lost, FoundPerson found) {

        if (lost.getPhotoUrls() == null || found.getPhotoUrls() == null)
            return false;

        // avoid duplicate match
        if (matchRepository.existsByLostIdAndFoundId(lost.getId(), found.getId()))
            return false;

        double confidence = faceMatchService.compareFaces(
                lost.getPhotoUrls(), 
                found.getPhotoUrls()
        );

        if (confidence >= threshold) {

            // --- SAVE MATCH ---
            Match m = new Match();
            m.setLostId(lost.getId());
            m.setFoundId(found.getId());
            m.setConfidence(confidence);
            m.setMatchedAt(LocalDateTime.now());
            matchRepository.save(m);

            // --- SEND SMS ---
            smsService.sendPersonMatchSMS(
                    lost.getContactPhone(),
                    found.getReporterPhone(),
                    found.getFoundLocation(),
                    found.getFoundTime() != null ? 
                        found.getFoundTime().toString() : "Not Provided",
                    found.getPhotoUrls(),
                    confidence
            );

            // --- DELETE BOTH ENTRIES ---
            lostRepo.deleteById(lost.getId());
            foundRepo.deleteById(found.getId());

            System.out.println(" PERSON MATCHED & REMOVED FROM TABLES");

            return true;
        }

        return false;
    }
}
