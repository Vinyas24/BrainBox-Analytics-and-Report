package com.internship.brainboxx.repository;

import com.internship.brainboxx.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Integer> {

    // Search papers by title containing keyword (case-insensitive)
    List<Paper> findByTitleContainingIgnoreCase(String keyword);
    List<Paper> findTop5ByOrderByViewCountDesc();
}

