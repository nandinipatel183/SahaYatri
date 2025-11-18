package com.practice.controller;

import com.practice.model.Match;
import com.practice.model.ItemMatch;
import com.practice.repository.MatchRepository;
import com.practice.repository.ItemMatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:5173")
public class MatchesController {

    private final MatchRepository matchRepository;
    private final ItemMatchRepository itemMatchRepository;

    public MatchesController(MatchRepository matchRepository,
                             ItemMatchRepository itemMatchRepository) {
        this.matchRepository = matchRepository;
        this.itemMatchRepository = itemMatchRepository;
    }

    // ---- GET ALL PERSON MATCHES ----
    @GetMapping("/people")
    public List<Match> getAllPersonMatches() {
        return matchRepository.findAll();
    }

    // ---- GET ALL ITEM MATCHES ----
    @GetMapping("/items")
    public List<ItemMatch> getAllItemMatches() {
        return itemMatchRepository.findAll();
    }

    // ---- COMBINED MATCH LIST FOR ADMIN ----
    @GetMapping
    public Object getAllMatches() {
        return new Object() {
            public final List<Match> peopleMatches = matchRepository.findAll();
            public final List<ItemMatch> itemMatches = itemMatchRepository.findAll();
        };
    }
}

