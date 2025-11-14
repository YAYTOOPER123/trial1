package uk.ac.ucl.comp0010.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Registration;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.RegistrationRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

@RestController
@RequestMapping("/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final ModuleRepository moduleRepository;

    public RegistrationController(
            RegistrationRepository registrationRepository,
            StudentRepository studentRepository,
            ModuleRepository moduleRepository) {
        this.registrationRepository = registrationRepository;
        this.studentRepository = studentRepository;
        this.moduleRepository = moduleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        return ResponseEntity.ok(registrations);
    }

    @PostMapping
    public ResponseEntity<Registration> createRegistration(@RequestBody Map<String, String> params) {
        Integer studentId = Integer.valueOf(params.get("student_id"));
        String moduleCode = params.get("module_code");

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        Module module = moduleRepository.findById(moduleCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Module not found"));

        if (registrationRepository.existsByStudentAndModule(student, module)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Student is already registered for this module");
        }

        Registration registration = new Registration();
        registration.setStudent(student);
        registration.setModule(module);

        Registration saved = registrationRepository.save(registration);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Registration>> getStudentRegistrations(@PathVariable Integer studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student not found"));

        List<Registration> registrations = registrationRepository.findAll().stream()
                .filter(r -> r.getStudent().getId().equals(studentId))
                .toList();

        return ResponseEntity.ok(registrations);
    }
}
