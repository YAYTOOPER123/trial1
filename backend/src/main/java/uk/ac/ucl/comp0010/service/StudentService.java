package uk.ac.ucl.comp0010.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

/**
 * Service class for Student-related business logic.
 */
@Service
public class StudentService {

  private final StudentRepository studentRepo;
  private final ModuleRepository moduleRepo;
  private final GradeRepository gradeRepo;
  private final RegistrationRepository registrationRepo;

  /**
   * Constructor for StudentService.
   *
   * @param studentRepo the student repository
   * @param moduleRepo the module repository
   * @param gradeRepo the grade repository
   * @param registrationRepo the registration repository
   */
  @Autowired
  public StudentService(StudentRepository studentRepo,
      ModuleRepository moduleRepo,
      GradeRepository gradeRepo,
      RegistrationRepository registrationRepo) {
    this.studentRepo = studentRepo;
    this.moduleRepo = moduleRepo;
    this.gradeRepo = gradeRepo;
    this.registrationRepo = registrationRepo;
  }

  /**
   * Finds all students.
   *
   * @return list of all students
   */
  public List<Student> findAll() {
    List<Student> students = new ArrayList<>();
    studentRepo.findAll().forEach(students::add);
    return students;
  }

  /**
   * Finds a student by ID.
   *
   * @param id the student ID
   * @return the student
   */
  public Student findById(Integer id) {
    return studentRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Student not found: " + id));
  }

  /**
   * Creates a new student.
   *
   * @param student the student to create
   * @return the created student
   */
  @Transactional
  public Student create(Student student) {
    return studentRepo.save(student);
  }

  /**
   * Updates an existing student.
   *
   * @param id the student ID
   * @param updates the updated student data
   * @return the updated student
   */
  @Transactional
  public Student update(Integer id, Student updates) {
    Student existing = findById(id);
    if (updates.getFirstName() != null) {
      existing.setFirstName(updates.getFirstName());
    }
    if (updates.getLastName() != null) {
      existing.setLastName(updates.getLastName());
    }
    if (updates.getUsername() != null) {
      existing.setUsername(updates.getUsername());
    }
    if (updates.getEmail() != null) {
      existing.setEmail(updates.getEmail());
    }
    return studentRepo.save(existing);
  }

  /**
   * Deletes a student.
   *
   * @param id the student ID
   */
  @Transactional
  public void delete(Integer id) {
    if (!studentRepo.existsById(id)) {
      throw new IllegalArgumentException("Student not found: " + id);
    }
    studentRepo.deleteById(id);
  }

  /**
   * Registers a student for a module.
   *
   * @param studentId the student ID
   * @param moduleCode the module code
   * @return the registration
   */
  @Transactional
  public Registration registerModule(Integer studentId, String moduleCode) {
    Student student = findById(studentId);
    Module module = moduleRepo.findById(moduleCode)
        .orElseThrow(() -> new IllegalArgumentException("Module not found: " + moduleCode));

    boolean already = registrationRepo.existsByStudentAndModule(student, module);
    if (already) {
      throw new IllegalArgumentException("Student already registered for module: " + moduleCode);
    }

    Registration reg = new Registration();
    reg.setStudent(student);
    reg.setModule(module);
    return registrationRepo.save(reg);
  }

  /**
   * Adds a grade for a student in a module.
   *
   * @param studentId the student ID
   * @param moduleCode the module code
   * @param score the grade score
   * @return the created grade
   */
  @Transactional
  public Grade addGrade(Integer studentId, String moduleCode, int score) {
    Student student = findById(studentId);
    Module module = moduleRepo.findById(moduleCode)
        .orElseThrow(() -> new IllegalArgumentException("Module not found: " + moduleCode));

    boolean registered = registrationRepo.existsByStudentAndModule(student, module);
    if (!registered) {
      throw new IllegalArgumentException("Student is not registered for module: " + moduleCode);
    }

    Grade grade = new Grade();
    grade.setStudent(student);
    grade.setModule(module);
    grade.setScore(score);
    return gradeRepo.save(grade);
  }

  /**
   * Gets a student's grade for a module.
   *
   * @param studentId the student ID
   * @param moduleCode the module code
   * @return the grade, or null if not found
   */
  public Grade getGrade(Integer studentId, String moduleCode) {
    Student student = findById(studentId);
    Module module = moduleRepo.findById(moduleCode)
        .orElseThrow(() -> new IllegalArgumentException("Module not found: " + moduleCode));
    return gradeRepo.findByStudentAndModule(student, module).orElse(null);
  }

  /**
   * Computes the average grade for a student.
   *
   * @param studentId the student ID
   * @return the average grade, or -1 if no grades
   */
  public double computeAverage(Integer studentId) {
    Student student = findById(studentId);
    List<Grade> grades = gradeRepo.findByStudent(student);
    if (grades == null || grades.isEmpty()) {
      return -1;
    }
    return grades.stream().mapToInt(Grade::getScore).average().orElse(-1);
  }
}
