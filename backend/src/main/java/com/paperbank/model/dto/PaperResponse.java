package com.paperbank.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaperResponse {
    private Long id;
    private String title;
    private String subjectName;
    private String subjectCode;
    private String course;
    private Integer semester;
    private Integer year;
    private String examType;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String uploadedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
