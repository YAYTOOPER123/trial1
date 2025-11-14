package uk.ac.ucl.comp0010.model;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Entity representing a student.
 */
@Entity
@Table(name = "student")
public class Student {

  @Id // schema.sql: id INT PRIMARY KEY
  private Integer id;

  @Column(length = 30)
  private String firstName;

  @Column(length = 30)
  private String lastName;

  @Column(length = 30)
  private String username;

  @Column(length = 50)
  private String email;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Grade> grades;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Registration> registrations;

    /**
   * Default constructor for JPA.
   */
  public Student() {}

  /**
   * Constructs a Student with all fields.
   *
   * @param id the student id
   * @param firstName the first name
   * @param lastName the last name
   * @param username the username
   * @param email the email
   */
  public Student(Integer id, String firstName, String lastName, String username, String email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
  }

  /**
   * Adds a grade for a specific module.
   *
   * @param module the module for which the grade is being added
   * @param score the grade score
   * */
  public double computeAverage(){
      if (grades == null || grades.isEmpty()){
          return -1;
      }
      return grades.stream().mapToInt(Grade::getScore).average().orElse(-1);
  }

  /**
   * Adds a grade for a specific module.
   *
   * @param module the module for which the grade is being added
   * @param score the grade score
   */
  public void addGrade(Module module, int score) {
      if (registrations.stream().noneMatch(reg -> reg.getModule().equals(module))) {
          throw new IllegalArgumentException("Student is not registered for the module: " + module.getCode());
      }
      Grade grade = new Grade();
      grade.setStudent(this);
      grade.setModule(module);
      grade.setScore(score);
      grades.add(grade);
  }


  /**
   * Retrieves the grade for a specific module.
   *
   * @param module the module for which the grade is being retrieved
   * @return the grade for the module, or null if no grade is available
   */
  public Grade getGrade(Module module) {
      return grades.stream()
              .filter(grade -> grade.getModule().equals(module))
              .findFirst()
              .orElse(null);
  }

    /**
     * Registers the student for a specific module.
     *
     * @param module the module to register for
     */
    public void registerModule(Module module) {
        if (registrations.stream().anyMatch(reg -> reg.getModule().equals(module))) {
            throw new IllegalArgumentException("Student is already registered for the module: " + module.getCode());
        }
        Registration registration = new Registration();
        registration.setStudent(this);
        registration.setModule(module);
        registrations.add(registration);
    }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
