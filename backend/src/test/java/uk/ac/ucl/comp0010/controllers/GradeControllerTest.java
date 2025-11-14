package uk.ac.ucl.comp0010.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.ucl.comp0010.model.Grade;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.model.Student;
import uk.ac.ucl.comp0010.repository.GradeRepository;
import uk.ac.ucl.comp0010.repository.ModuleRepository;
import uk.ac.ucl.comp0010.repository.StudentRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for GradeController.addGrade endpoint.
 */
@WebMvcTest(controllers = GradeController.class)
@AutoConfigureMockMvc(addFilters = false) // bypass Spring Security filters in tests
class GradeControllerTest {

    @Autowired MockMvc mvc;

    @MockBean GradeRepository gradeRepository;
    @MockBean StudentRepository studentRepository;
    @MockBean ModuleRepository moduleRepository;

    @Autowired ObjectMapper objectMapper;

    @Test
    void addGrade_returnsSavedGrade_ok() throws Exception {
        // Arrange existing student & module
        Student s = new Student(1, "Alice", "Smith", "alice01", "alice@example.com");
        Module m = new Module("COMP0010", "Software Engineering", false);

        Grade saved = new Grade();
        saved.setId(99L);
        saved.setScore(85);
        saved.setStudent(s);
        saved.setModule(m);

        // If your StudentRepository uses Integer IDs, change 1L -> 1 below.
        when(studentRepository.findById(1)).thenReturn(Optional.of(s));
        when(moduleRepository.findById("COMP0010")).thenReturn(Optional.of(m));
        when(gradeRepository.save(any(Grade.class))).thenReturn(saved);

        String body = """
      {"studentId":"1","moduleCode":"COMP0010","score":"85"}
      """;

        // Act + Assert response
        mvc.perform(post("/grades/addGrade")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99))
                .andExpect(jsonPath("$.score").value(85))
                .andExpect(jsonPath("$.student.id").value(1))
                .andExpect(jsonPath("$.module.code").value("COMP0010"));

        // Assert the Grade passed to save(..) had the right fields
        ArgumentCaptor<Grade> cap = ArgumentCaptor.forClass(Grade.class);
        verify(gradeRepository).save(cap.capture());
        Grade toSave = cap.getValue();
        assertEquals(85, toSave.getScore());
        assertEquals(1, toSave.getStudent().getId());
        assertEquals("COMP0010", toSave.getModule().getCode());
    }

    @Test
    void addGrade_studentNotFound_returns5xx() throws Exception {
        when(studentRepository.findById(123)).thenReturn(Optional.empty());

        String body = """
      {"studentId":"123","moduleCode":"COMP0010","score":"70"}
      """;

        mvc.perform(post("/grades/addGrade")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void addGrade_moduleNotFound_returns5xx() throws Exception {
        Student s = new Student(1, "Alice", "Smith", "alice01", "alice@example.com");
        when(studentRepository.findById(1)).thenReturn(Optional.of(s));
        when(moduleRepository.findById("NOPE")).thenReturn(Optional.empty());

        String body = """
      {"studentId":"1","moduleCode":"NOPE","score":"70"}
      """;

        mvc.perform(post("/grades/addGrade")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }
}
