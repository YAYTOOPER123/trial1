import React from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { AppRegistration, Person, School, CheckCircle } from "@mui/icons-material";
import App from "../App";
import { API_ENDPOINT } from "../config";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface Module {
  code: string;
  name: string;
  mnc: boolean;
}

interface Registration {
  id: number;
  student: Student;
  module: Module;
}

function Registrations() {
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [selectedStudent, setSelectedStudent] = React.useState<number | "">("");
  const [selectedModule, setSelectedModule] = React.useState<string>("");
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    updateData();
  }, []);

  function updateData() {
    Promise.all([
      axios.get(`${API_ENDPOINT}/registrations`).catch(() => ({ data: [] })),
      axios.get(`${API_ENDPOINT}/students`).catch(() => ({ data: [] })),
      axios.get(`${API_ENDPOINT}/modules`).catch(() => ({ data: [] })),
    ]).then(([regRes, studRes, modRes]) => {
      setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
      setStudents(Array.isArray(studRes.data) ? studRes.data : []);
      setModules(Array.isArray(modRes.data) ? modRes.data : []);
    });
  }

  function handleRegister() {
    if (!selectedStudent || !selectedModule) {
      setError("Please select both a student and a module");
      return;
    }

    setError(undefined);
    setSuccess(false);

    axios
      .post(`${API_ENDPOINT}/registrations`, {
        student_id: selectedStudent,
        module_code: selectedModule,
      })
      .then(() => {
        setSuccess(true);
        setSelectedStudent("");
        setSelectedModule("");
        updateData();
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to register";
        setError(errorMsg);
        console.error("Error registering:", err.response?.data || err);
      });
  }

  function getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  }

  function getAvatarColor(id?: number): string {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"];
    return colors[(id ?? 0) % colors.length];
  }

  return (
    <App>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
          Registrations
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Register students for modules
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {registrations.length === 0 ? (
            <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
              <AppRegistration sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No registrations yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register a student for a module to get started
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {registrations.map((reg, index) => (
                <Grid item xs={12} key={reg.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
                      "@keyframes slideIn": {
                        from: { opacity: 0, transform: "translateX(-20px)" },
                        to: { opacity: 1, transform: "translateX(0)" },
                      },
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: "1 1 300px" }}>
                          <Avatar
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: getAvatarColor(reg.student.id),
                              fontSize: 18,
                              fontWeight: 700,
                            }}
                          >
                            {getInitials(reg.student.firstName, reg.student.lastName)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Person sx={{ fontSize: 18, color: "text.secondary" }} />
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {reg.student.firstName} {reg.student.lastName}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              ID: {reg.student.id}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: "1 1 250px" }}>
                          <School sx={{ fontSize: 20, color: "text.secondary" }} />
                          <Box>
                            <Chip
                              label={reg.module.code}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                                color: "white",
                                mb: 0.5,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {reg.module.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ flex: "0 0 auto" }}>
                          <Chip
                            icon={<CheckCircle />}
                            label="Registered"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              position: "sticky",
              top: 20,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <AppRegistration sx={{ color: "white" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Register Student
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value as number)}
                  label="Student"
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {`${s.firstName} ${s.lastName} (${s.id})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  label="Module"
                >
                  {modules.map((m) => (
                    <MenuItem key={m.code} value={m.code}>
                      {`${m.code} - ${m.name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleRegister}
                fullWidth
                size="large"
                sx={{
                  background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                  color: "white",
                  fontWeight: 700,
                  py: 1.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)",
                  },
                }}
              >
                Register
              </Button>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                Registration successful!
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </App>
  );
}

export default Registrations;
