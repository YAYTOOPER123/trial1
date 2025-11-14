package uk.ac.ucl.comp0010.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entity representing a grade for a student in a module.
 */
@Entity
@Table(name = "grade")
public class Grade {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Integer score;

  @ManyToOne(optional = false)
  @JoinColumn(name = "student_id")
  private Student student;

  @ManyToOne(optional = false)
  @JoinColumn(name = "module_code")
  private Module module;

  /**
   * Default constructor for JPA.
   */
  public Grade() {}

  /**
   * Constructs a Grade with score, student, and module.
   *
   * @param score the score
   * @param student the student
   * @param module the module
   */
  public Grade(Integer score, Student student, Module module) {
    this.score = score;
    this.student = student;
    this.module = module;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Integer getScore() {
    return score;
  }

  public void setScore(Integer score) {
    this.score = score;
  }

  public Student getStudent() {
    return student;
  }

  public void setStudent(Student student) {
    this.student = student;
  }

  public Module getModule() {
    return module;
  }

  public void setModule(Module module) {
    this.module = module;
  }
}
