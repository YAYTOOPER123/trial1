package uk.ac.ucl.comp0010.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

/**
 * Controller for handling grade-related operations.
 */
@RestController
@RequestMapping("/grades")
public class GradeController {

  private final GradeRepository gradeRepository;
  private final StudentRepository studentRepository;
  private final ModuleRepository moduleRepository;

  /**
   * Constructs a GradeController with required repositories.
   *
   * @param gradeRepository the grade repository
   * @param studentRepository the student repository
   * @param moduleRepository the module repository
   */
  public GradeController(GradeRepository gradeRepository,
      StudentRepository studentRepository,
      ModuleRepository moduleRepository) {
    this.gradeRepository = gradeRepository;
    this.studentRepository = studentRepository;
    this.moduleRepository = moduleRepository;
  }


  /**
   * Adds a grade for a student and module.
   *
   * @param params a map containing student_id, module_code, and score
   * @return the saved Grade entity
   */
  @PostMapping("/addGrade")
  public ResponseEntity<Grade> addGrade(@RequestBody Map<String, String> params) {
    Integer studentId = Integer.valueOf(params.get("student_id"));
    String moduleCode = params.get("module_code");
    int score = Integer.parseInt(params.get("score"));

    Student student = studentRepository.findById(studentId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Student not found"));
    Module module = moduleRepository.findById(moduleCode)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Module not found"));

    Grade grade = new Grade();
    grade.setScore(score);
    grade.setStudent(student);
    grade.setModule(module);

    Grade savedGrade = gradeRepository.save(grade);
    return ResponseEntity.ok(savedGrade);
  }

  /**
   * Gets all grades.
   *
   * @return all grades
   */
  @GetMapping
  public ResponseEntity<Iterable<Grade>> getAllGrades() {
    Iterable<Grade> grades = gradeRepository.findAll();
    return ResponseEntity.ok(grades);
  }
}
