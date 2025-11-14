package uk.ac.ucl.comp0010.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ModuleTest {

    @Test
    void noArgsConstructor_setters_getters() {
        Module m = new Module();          // exercises default ctor
        m.setCode("COMP0010");
        m.setName("Software Engineering");
        m.setMnc(false);

        assertEquals("COMP0010", m.getCode());
        assertEquals("Software Engineering", m.getName());
        assertFalse(m.getMnc());

        // flip once more just to run setter/getter again
        m.setMnc(true);
        assertTrue(m.getMnc());
    }

    @Test
    void allArgsConstructor_getters() {
        Module m = new Module("COMP0001", "Intro", true);  // exercises all-args ctor
        assertEquals("COMP0001", m.getCode());
        assertEquals("Intro", m.getName());
        assertTrue(m.getMnc());
    }
}
