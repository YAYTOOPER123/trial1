package uk.ac.ucl.comp0010.repository;

import org.springframework.data.repository.CrudRepository;

import uk.ac.ucl.comp0010.model.Module;

/**
 * Repository interface for Module entities.
 */
public interface ModuleRepository extends CrudRepository<Module, String> {
  // No additional methods required - code is the primary key
}
