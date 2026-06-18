package com.paperbank.repository;

import com.paperbank.model.Paper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {

    Page<Paper> findByCourse(String course, Pageable pageable);

    Page<Paper> findBySemester(Integer semester, Pageable pageable);

    Page<Paper> findByYear(Integer year, Pageable pageable);

    Page<Paper> findByCourseAndSemester(String course, Integer semester, Pageable pageable);

    @Query("SELECT p FROM Paper p WHERE " +
           "(:course IS NULL OR p.course = :course) AND " +
           "(:semester IS NULL OR p.semester = :semester) AND " +
           "(:year IS NULL OR p.year = :year) AND " +
           "(:subjectName IS NULL OR LOWER(p.subjectName) LIKE LOWER(CONCAT('%', :subjectName, '%')))")
    Page<Paper> searchPapers(
            @Param("course") String course,
            @Param("semester") Integer semester,
            @Param("year") Integer year,
            @Param("subjectName") String subjectName,
            Pageable pageable
    );

    @Query("SELECT p FROM Paper p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.subjectName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.subjectCode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Paper> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT p.course FROM Paper p ORDER BY p.course")
    List<String> findDistinctCourses();

    @Query("SELECT DISTINCT p.subjectName FROM Paper p WHERE p.course = :course ORDER BY p.subjectName")
    List<String> findDistinctSubjectsByCourse(@Param("course") String course);

    @Query("SELECT DISTINCT p.year FROM Paper p ORDER BY p.year DESC")
    List<Integer> findDistinctYears();

    long countByCourse(String course);
}
