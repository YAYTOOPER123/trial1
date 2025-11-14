package uk.ac.ucl.comp0010.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;

/**
 * Repository interface for Registration entities.
 */
@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Integer> {
  boolean existsByStudentAndModule(Student student, Module module);
}
