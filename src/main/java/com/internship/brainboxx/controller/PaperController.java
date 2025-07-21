package com.internship.brainboxx.controller;

import com.internship.brainboxx.model.Paper;
import com.internship.brainboxx.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
            paper.setEdit_count(paper.getEdit_count() + 1);
            paper.setContributor(updatedPaper.getContributor());
            paperRepository.save(paper);
        }
        return paper;
    }

    // GET: Search papers by keyword
    @GetMapping("/search")
    public List<Paper> searchPapers(@RequestParam String keyword) {
        return paperRepository.findByTitleContainingIgnoreCase(keyword);
    }

}

