package uk.ac.ucl.comp0010.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entity representing a module.
 */
@Entity
@Table(name = "module")
public class Module {

  @Id
  @Column(name = "code", length = 10, nullable = false)
  private String code;

  @Column(name = "name", length = 100)
  private String name;

  private Boolean mnc;

  /**
   * Default constructor for JPA.
   */
  public Module() {}

  /**
   * Constructs a Module with code, name, and mnc.
   *
   * @param code the module code
   * @param name the module name
   * @param mnc the mnc flag
   */
  public Module(String code, String name, Boolean mnc) {
    this.code = code;
    this.name = name;
    this.mnc = mnc;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getMnc() {
    return mnc;
  }

  public void setMnc(Boolean mnc) {
    this.mnc = mnc;
  }
}