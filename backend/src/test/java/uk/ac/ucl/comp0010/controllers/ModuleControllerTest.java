package uk.ac.ucl.comp0010.controllers;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import uk.ac.ucl.comp0010.model.Module;
import uk.ac.ucl.comp0010.repository.ModuleRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Tests for ModuleController.addModule endpoint. */
@WebMvcTest(controllers = ModuleController.class)
@AutoConfigureMockMvc(addFilters = false) // bypass security filters in tests
class ModuleControllerTest {

    @Autowired MockMvc mvc;

    @MockBean ModuleRepository moduleRepository;

    @Test
    void addModule_creates_andReturns201() throws Exception {
        // Arrange: module does not exist
        when(moduleRepository.existsById("COMP0010")).thenReturn(false);
        Module saved = new Module("COMP0010", "Software Engineering", true);
        when(moduleRepository.save(any(Module.class))).thenReturn(saved);

        String body = """
      {"code":"COMP0010","name":"Software Engineering","mnc":"true"}
      """;

        // Act + Assert
        mvc.perform(post("/modules/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMP0010"))
                .andExpect(jsonPath("$.name").value("Software Engineering"))
                .andExpect(jsonPath("$.mnc").value(true));

        // Verify the Module passed to save(...) has correct fields
        ArgumentCaptor<Module> cap = ArgumentCaptor.forClass(Module.class);
        verify(moduleRepository).save(cap.capture());
        Module toSave = cap.getValue();
        assertEquals("COMP0010", toSave.getCode());
        assertEquals("Software Engineering", toSave.getName());
        assertTrue(Boolean.TRUE.equals(toSave.getMnc()));
    }

    @Test
    void addModule_conflict_whenAlreadyExists_returns409() throws Exception {
        when(moduleRepository.existsById("COMP0010")).thenReturn(true);

        String body = """
      {"code":"COMP0010","name":"SE","mnc":"false"}
      """;

        mvc.perform(post("/modules/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());

        verify(moduleRepository, never()).save(any());
    }

    @Test
    void addModule_badRequest_whenCodeBlank_returns400() throws Exception {
        String body = """
      {"code":"","name":"Any","mnc":"false"}
      """;

        mvc.perform(post("/modules/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        verify(moduleRepository, never()).existsById(any());
        verify(moduleRepository, never()).save(any());
    }
}
