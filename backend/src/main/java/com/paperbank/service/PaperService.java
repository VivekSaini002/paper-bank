package com.paperbank.service;

import com.paperbank.exception.ResourceNotFoundException;
import com.paperbank.model.Paper;
import com.paperbank.model.User;
import com.paperbank.model.dto.PaperResponse;
import com.paperbank.repository.PaperRepository;
import com.paperbank.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PaperService {

    private final PaperRepository paperRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public PaperService(PaperRepository paperRepository,
                        UserRepository userRepository,
                        FileStorageService fileStorageService) {
        this.paperRepository = paperRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public PaperResponse uploadPaper(String title, String subjectName, String subjectCode,
                                      String course, Integer semester, Integer year,
                                      String examType, MultipartFile file, String uploaderEmail) {

        User uploader = userRepository.findByEmail(uploaderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", uploaderEmail));

        String storedFileName = fileStorageService.storeFile(file);
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);

        Paper paper = Paper.builder()
                .title(title)
                .subjectName(subjectName)
                .subjectCode(subjectCode)
                .course(course)
                .semester(semester)
                .year(year)
                .examType(examType)
                .fileName(storedFileName)
                .filePath(storedFileName)
                .fileType(extension.toLowerCase())
                .fileSize(file.getSize())
                .uploadedBy(uploader)
                .build();

        Paper savedPaper = paperRepository.save(paper);
        return mapToResponse(savedPaper);
    }

    public Page<PaperResponse> getAllPapers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return paperRepository.findAll(pageable).map(this::mapToResponse);
    }

    public PaperResponse getPaperById(Long id) {
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", id));
        return mapToResponse(paper);
    }

    public Paper getPaperEntity(Long id) {
        return paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", id));
    }

    public PaperResponse updatePaper(Long id, String title, String subjectName, String subjectCode,
                                      String course, Integer semester, Integer year, String examType) {
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", id));

        if (title != null) paper.setTitle(title);
        if (subjectName != null) paper.setSubjectName(subjectName);
        if (subjectCode != null) paper.setSubjectCode(subjectCode);
        if (course != null) paper.setCourse(course);
        if (semester != null) paper.setSemester(semester);
        if (year != null) paper.setYear(year);
        if (examType != null) paper.setExamType(examType);

        Paper updatedPaper = paperRepository.save(paper);
        return mapToResponse(updatedPaper);
    }

    public void deletePaper(Long id) {
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", id));

        fileStorageService.deleteFile(paper.getFileName());
        paperRepository.delete(paper);
    }

    public Page<PaperResponse> searchPapers(String course, Integer semester, Integer year,
                                             String subjectName, int page, int size,
                                             String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return paperRepository.searchPapers(course, semester, year, subjectName, pageable)
                .map(this::mapToResponse);
    }

    public Page<PaperResponse> searchByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return paperRepository.searchByKeyword(keyword, pageable).map(this::mapToResponse);
    }

    public List<String> getDistinctCourses() {
        return paperRepository.findDistinctCourses();
    }

    public List<String> getDistinctSubjectsByCourse(String course) {
        return paperRepository.findDistinctSubjectsByCourse(course);
    }

    public List<Integer> getDistinctYears() {
        return paperRepository.findDistinctYears();
    }

    public long getTotalPaperCount() {
        return paperRepository.count();
    }

    private PaperResponse mapToResponse(Paper paper) {
        return PaperResponse.builder()
                .id(paper.getId())
                .title(paper.getTitle())
                .subjectName(paper.getSubjectName())
                .subjectCode(paper.getSubjectCode())
                .course(paper.getCourse())
                .semester(paper.getSemester())
                .year(paper.getYear())
                .examType(paper.getExamType())
                .fileName(paper.getFileName())
                .fileType(paper.getFileType())
                .fileSize(paper.getFileSize())
                .uploadedByName(paper.getUploadedBy() != null ? paper.getUploadedBy().getFullName() : "Unknown")
                .createdAt(paper.getCreatedAt())
                .updatedAt(paper.getUpdatedAt())
                .build();
    }
}
