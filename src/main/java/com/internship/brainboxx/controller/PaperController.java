package com.internship.brainboxx.controller;

import com.internship.brainboxx.model.Paper;
import com.internship.brainboxx.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

    @Autowired
    private PaperRepository paperRepository;

    // GET: Fetch all papers
    @GetMapping
    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }

    // GET: Fetch single paper by ID
    @GetMapping("/{id}")
    public Paper getPaperById(@PathVariable int id) {
        return paperRepository.findById(id).orElse(null);
    }

    // PUT: Update paper content
    @PutMapping("/{id}")
    public Paper updatePaper(@PathVariable int id, @RequestBody Paper updatedPaper) {
        Paper paper = paperRepository.findById(id).orElse(null);
        if (paper != null) {
            paper.setContent(updatedPaper.getContent());
            paper.setEditCount(paper.getEditCount() + 1);
            paper.setContributor(updatedPaper.getContributor());
            paper.setUpdated_at(new Timestamp(System.currentTimeMillis()));
            paperRepository.save(paper);
        }
        return paper;
    }

    @GetMapping("/search")
    public List<Paper> searchPapers(@RequestParam String keyword) {
        return paperRepository.findByTitleContainingIgnoreCase(keyword);
    }

    @GetMapping("/read/{id}")
    public Paper readPaper(@PathVariable int id) {
        Paper paper = paperRepository.findById(id).orElse(null);
        if (paper != null) {
            paper.setViewCount(paper.getViewCount() + 1);
            paperRepository.save(paper);
        }
        return paper;
    }

    @GetMapping("/popular")
    public List<Paper> getPopularPapers() {
        return paperRepository.findTop5ByOrderByViewCountDesc();
    }

}

