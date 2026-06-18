package com.paperbank.controller;

import com.paperbank.model.Role;
import com.paperbank.repository.PaperRepository;
import com.paperbank.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PaperRepository paperRepository;

    public AdminController(UserRepository userRepository, PaperRepository paperRepository) {
        this.userRepository = userRepository;
        this.paperRepository = paperRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPapers", paperRepository.count());
        stats.put("totalStudents", userRepository.countByRole(Role.ROLE_STUDENT));
        stats.put("totalAdmins", userRepository.countByRole(Role.ROLE_ADMIN));
        stats.put("courses", paperRepository.findDistinctCourses());
        stats.put("years", paperRepository.findDistinctYears());
        return ResponseEntity.ok(stats);
    }
}
