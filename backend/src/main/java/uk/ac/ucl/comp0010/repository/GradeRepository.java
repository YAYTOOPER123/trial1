package uk.ac.ucl.comp0010.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;

/**
 * Repository interface for Grade entities.
 */
public interface GradeRepository extends CrudRepository<Grade, Long> {
  Optional<Grade> findByStudentAndModule(Student student, Module module);

  List<Grade> findByStudent(Student student);
}
