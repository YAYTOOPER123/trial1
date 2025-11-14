package uk.ac.ucl.comp0010.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class GradeTest {
    @Test
    void noArgsConstructor_and_accessors() {
        Student s = new Student(); s.setId(1); s.setFirstName("A"); s.setLastName("B"); s.setUsername("u"); s.setEmail("e@x");
        Module m = new Module("COMP0010","SE",false);

        Grade g = new Grade();
        g.setId(5L);
        g.setScore(90);
        g.setStudent(s);
        g.setModule(m);

        assertEquals(5L, g.getId());
        assertEquals(90, g.getScore());
        assertEquals(1, g.getStudent().getId());
        assertEquals("COMP0010", g.getModule().getCode());
    }

    @Test
    void allArgsConstructor_setsFields() {
        Student s = new Student(); s.setId(2);
        Module m = new Module("COMP0001","Intro",true);
        Grade g = new Grade(77, s, m);
        assertEquals(77, g.getScore());
        assertEquals(2, g.getStudent().getId());
        assertEquals("COMP0001", g.getModule().getCode());
    }
}
