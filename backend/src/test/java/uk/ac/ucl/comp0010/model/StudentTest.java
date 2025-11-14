package uk.ac.ucl.comp0010.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void noArgsConstructor_setters_getters() {
        Student s = new Student();
        s.setId(1);
        s.setFirstName("Alice");
        s.setLastName("Smith");
        s.setUsername("alice01");
        s.setEmail("alice@example.com");

        assertEquals(1, s.getId());
        assertEquals("Alice", s.getFirstName());
        assertEquals("Smith", s.getLastName());
        assertEquals("alice01", s.getUsername());
        assertEquals("alice@example.com", s.getEmail());
    }

    @Test
    void allArgsConstructor_getters() {
        Student s = new Student(2, "Bob", "Jones", "bobj", "bob@example.com");

        assertEquals(2, s.getId());
        assertEquals("Bob", s.getFirstName());
        assertEquals("Jones", s.getLastName());
        assertEquals("bobj", s.getUsername());
        assertEquals("bob@example.com", s.getEmail());
    }
}
