package com.paperbank.controller;

import com.paperbank.model.Paper;
import com.paperbank.model.dto.AIQueryRequest;
import com.paperbank.service.FileStorageService;
import com.paperbank.service.GeminiService;
import com.paperbank.service.PaperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final GeminiService geminiService;
    private final PaperService paperService;
    private final FileStorageService fileStorageService;

    public AIController(GeminiService geminiService,
                        PaperService paperService,
                        FileStorageService fileStorageService) {
        this.geminiService = geminiService;
        this.paperService = paperService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/analyze-paper/{id}")
    public ResponseEntity<Map<String, String>> analyzePaper(@PathVariable Long id) {
        Paper paper = paperService.getPaperEntity(id);
        byte[] fileBytes = fileStorageService.loadFileAsBytes(paper.getFileName());
        
        String result = geminiService.analyzePaperFile(
                fileBytes,
                paper.getFileType(),
                paper.getTitle(),
                paper.getSubjectName(),
                paper.getSubjectCode(),
                paper.getYear(),
                paper.getSemester()
        );

        Map<String, String> response = new HashMap<>();
        response.put("paperId", id.toString());
        response.put("paperTitle", paper.getTitle());
        response.put("analysis", result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody AIQueryRequest request) {
        String response;

        if (request.getPaperId() != null) {
            Paper paper = paperService.getPaperEntity(request.getPaperId());
            String enhancedQuery = String.format(
                    "Context: This question is about the subject '%s' (Code: %s), " +
                    "Course: %s, Semester: %d, Year: %d.\n\nQuestion: %s",
                    paper.getSubjectName(), paper.getSubjectCode(),
                    paper.getCourse(), paper.getSemester(), paper.getYear(),
                    request.getQuery()
            );
            response = geminiService.chat(enhancedQuery);
        } else {
            response = geminiService.chat(request.getQuery());
        }

        Map<String, String> result = new HashMap<>();
        result.put("query", request.getQuery());
        result.put("response", response);

        return ResponseEntity.ok(result);
    }
}
