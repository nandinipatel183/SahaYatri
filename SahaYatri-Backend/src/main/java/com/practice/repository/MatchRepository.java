package com.practice.repository;

import com.practice.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    boolean existsByLostIdAndFoundId(Long lostId, Long foundId);
    Optional<Match> findByLostIdAndFoundId(Long lostId, Long foundId);
}
