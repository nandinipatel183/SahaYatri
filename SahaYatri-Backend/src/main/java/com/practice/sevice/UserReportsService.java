package com.practice.sevice;

import com.practice.model.*;
import com.practice.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserReportsService {

    private final LostPersonRepository lostPersonRepo;
    private final FoundPersonRepository foundPersonRepo;
    private final LostItemRepository lostItemRepo;
    private final FoundItemRepository foundItemRepo;

    public UserReportsService(LostPersonRepository lpr, FoundPersonRepository fpr, LostItemRepository lir, FoundItemRepository fir) {
        this.lostPersonRepo = lpr;
        this.foundPersonRepo = fpr;
        this.lostItemRepo = lir;
        this.foundItemRepo = fir;
    }

    public List<LostPerson> getMyLostPersons(String email) {
        return lostPersonRepo.findByUserEmail(email);
    }

    public List<FoundPerson> getMyFoundPersons(String email) {
        return foundPersonRepo.findByUserEmail(email);
    }

    public List<LostItem> getMyLostItems(String email) {
        return lostItemRepo.findByUserEmail(email);
    }

    public List<FoundItem> getMyFoundItems(String email) {
        return foundItemRepo.findByUserEmail(email);
    }
}
