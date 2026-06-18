package com.paperbank.controller;

import com.paperbank.model.dto.PaperResponse;
import com.paperbank.service.FileStorageService;
import com.paperbank.service.PaperService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

    private final PaperService paperService;
    private final FileStorageService fileStorageService;

    public PaperController(PaperService paperService, FileStorageService fileStorageService) {
        this.paperService = paperService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PaperResponse> uploadPaper(
            @RequestParam("title") String title,
            @RequestParam("subjectName") String subjectName,
            @RequestParam("subjectCode") String subjectCode,
            @RequestParam("course") String course,
            @RequestParam("semester") Integer semester,
            @RequestParam("year") Integer year,
            @RequestParam(value = "examType", required = false) String examType,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        PaperResponse response = paperService.uploadPaper(
                title, subjectName, subjectCode, course, semester, year,
                examType, file, authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<PaperResponse>> getAllPapers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Page<PaperResponse> papers = paperService.getAllPapers(page, size, sortBy, direction);
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaperResponse> getPaperById(@PathVariable Long id) {
        PaperResponse paper = paperService.getPaperById(id);
        return ResponseEntity.ok(paper);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaperResponse> updatePaper(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String subjectName,
            @RequestParam(required = false) String subjectCode,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String examType) {

        PaperResponse response = paperService.updatePaper(
                id, title, subjectName, subjectCode, course, semester, year, examType
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePaper(@PathVariable Long id) {
        paperService.deletePaper(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Paper deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadPaper(@PathVariable Long id) {
        var paper = paperService.getPaperEntity(id);
        Resource resource = fileStorageService.loadFileAsResource(paper.getFileName());
        String contentType = fileStorageService.getContentType(paper.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + paper.getTitle() + "." + paper.getFileType() + "\"")
                .body(resource);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PaperResponse>> searchPapers(
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String subjectName,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        if (keyword != null && !keyword.isEmpty()) {
            return ResponseEntity.ok(paperService.searchByKeyword(keyword, page, size));
        }

        Page<PaperResponse> papers = paperService.searchPapers(
                course, semester, year, subjectName, page, size, sortBy, direction
        );
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/filters/courses")
    public ResponseEntity<List<String>> getCourses() {
        return ResponseEntity.ok(paperService.getDistinctCourses());
    }

    @GetMapping("/filters/subjects")
    public ResponseEntity<List<String>> getSubjects(@RequestParam String course) {
        return ResponseEntity.ok(paperService.getDistinctSubjectsByCourse(course));
    }

    @GetMapping("/filters/years")
    public ResponseEntity<List<Integer>> getYears() {
        return ResponseEntity.ok(paperService.getDistinctYears());
    }
}
