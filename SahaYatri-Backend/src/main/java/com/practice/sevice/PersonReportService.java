package com.practice.sevice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practice.model.FoundPerson;
import com.practice.model.LostPerson;
import com.practice.repository.FoundPersonRepository;
import com.practice.repository.LostPersonRepository;

@Service
public class PersonReportService {

    @Autowired
    private FoundPersonRepository foundPersonRepo;

    @Autowired
    private LostPersonRepository lostPersonRepo;

    public FoundPerson saveFoundPerson(FoundPerson person) {
        return foundPersonRepo.save(person);
    }

    public LostPerson saveLostPerson(LostPerson person) {
        return lostPersonRepo.save(person);
    }
}
