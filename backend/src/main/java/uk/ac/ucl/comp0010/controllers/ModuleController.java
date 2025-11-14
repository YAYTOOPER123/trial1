package uk.ac.ucl.comp0010.controllers;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.repository.ModuleRepository;

/**
 * Controller for handling module-related operations.
 */
@RestController
@RequestMapping("/modules")
public class ModuleController {
  /** The module repository. */
  private final ModuleRepository moduleRepository;

  /**
   * Constructs a ModuleController with required repository.
   *
   * @param moduleRepository the module repository
   * @throws NullPointerException if moduleRepository is null
   */
  public ModuleController(ModuleRepository moduleRepository) {
    if (moduleRepository == null) {
      throw new NullPointerException("moduleRepository must not be null");
    }
    this.moduleRepository = moduleRepository;
  }

  /**
   * Adds a module to the repository.
   *
   * @param params a map containing code, name, and mnc
   * @return the saved Module entity or error response
   */
  @PostMapping("/add")
  public ResponseEntity<Module> addModule(@RequestBody Map<String, String> params) {
    String code = params.get("code");
    String name = params.get("name");
    boolean mnc = Boolean.parseBoolean(params.get("mnc"));

    if (code == null || code.isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    if (moduleRepository.existsById(code)) {
      // 409 Conflict: module already exists
      return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    Module module = new Module(code, name, mnc);
    Module savedModule = moduleRepository.save(module);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedModule);
  }

  /**
   * Gets all modules from the repository.
   *
   * @return a ResponseEntity containing all modules
   */
  @GetMapping
  public ResponseEntity<Iterable<Module>> getAllModules() {
    Iterable<Module> modules = moduleRepository.findAll();
    return ResponseEntity.ok(modules);
  }
}
