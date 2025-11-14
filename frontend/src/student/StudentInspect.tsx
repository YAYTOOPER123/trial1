import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  Email,
  AccountCircle,
  School,
  TrendingUp,
  EmojiEvents,
  ArrowBack,
} from "@mui/icons-material";
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

interface Grade {
  id: number;
  score: number;
  module: Module;
}

interface Registration {
  id: number;
  module: Module;
}

function StudentInspect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = React.useState<Student | null>(null);
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;

    Promise.all([
      axios.get(`${API_ENDPOINT}/students/${id}`),
      axios.get(`${API_ENDPOINT}/grades`),
      axios.get(`${API_ENDPOINT}/registrations/student/${id}`),
    ])
      .then(([studentRes, gradesRes, registrationsRes]) => {
        setStudent(studentRes.data);
        const studentGrades = gradesRes.data.filter(
          (g: any) => g.student.id === parseInt(id)
        );
        setGrades(studentGrades);
        setRegistrations(registrationsRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading student data:", error);
        setLoading(false);
      });
  }, [id]);

  const averageScore = React.useMemo(() => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => sum + g.score, 0);
    return (total / grades.length).toFixed(1);
  }, [grades]);

  function getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return "#2ecc71";
    if (score >= 80) return "#3498db";
    if (score >= 70) return "#f39c12";
    if (score >= 60) return "#e67e22";
    return "#e74c3c";
  }

  function getScoreLabel(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Pass";
    return "Needs Improvement";
  }

  if (loading) {
    return (
      <App>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress size={60} sx={{ color: "#3498db" }} />
        </Box>
      </App>
    );
  }

  if (!student) {
    return (
      <App>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
            Student not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/students")}
            sx={{ background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)" }}
          >
            Back to Students
          </Button>
        </Box>
      </App>
    );
  }

  return (
    <App>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/students")}
        sx={{
          color: "white",
          mb: 3,
          "&:hover": { background: "rgba(255,255,255,0.1)" },
        }}
      >
        Back to Students
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#3498db",
                fontSize: 48,
                fontWeight: 700,
                margin: "0 auto",
                mb: 3,
              }}
            >
              {getInitials(student.firstName, student.lastName)}
            </Avatar>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              {student.firstName} {student.lastName}
            </Typography>
            <Chip
              label={`ID: ${student.id}`}
              sx={{
                bgcolor: "rgba(52, 152, 219, 0.2)",
                color: "#3498db",
                fontWeight: 600,
                mb: 3,
              }}
            />

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

            <Box sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AccountCircle sx={{ color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body1" sx={{ color: "white" }}>
                  {student.username}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body1" sx={{ color: "white", wordBreak: "break-all" }}>
                  {student.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              mt: 3,
              textAlign: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 40, color: "white", mb: 1 }} />
            <Typography variant="h3" sx={{ color: "white", fontWeight: 800 }}>
              {averageScore}
            </Typography>
            <Typography variant="body1" sx={{ color: "white", opacity: 0.9 }}>
              Average Score
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <EmojiEvents sx={{ fontSize: 32, color: "#f39c12", mr: 2 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                Achievements
              </Typography>
            </Box>

            {grades.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 4 }}>
                No grades recorded yet
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {grades.map((grade) => (
                  <Grid item xs={12} sm={6} key={grade.id}>
                    <Card
                      sx={{
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 16px ${getScoreColor(grade.score)}44`,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box>
                            <Chip
                              label={grade.module.code}
                              size="small"
                              sx={{
                                bgcolor: "rgba(46, 204, 113, 0.2)",
                                color: "#2ecc71",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              {grade.module.name}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${getScoreColor(grade.score)} 0%, ${getScoreColor(grade.score)}dd 100%)`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                boxShadow: `0 4px 12px ${getScoreColor(grade.score)}44`,
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                {grade.score}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: getScoreColor(grade.score),
                                fontWeight: 600,
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {getScoreLabel(grade.score)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <School sx={{ fontSize: 32, color: "#3498db", mr: 2 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                Registered Modules
              </Typography>
            </Box>

            {registrations.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 4 }}>
                Not registered for any modules yet
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {registrations.map((reg) => (
                  <Grid item xs={12} sm={6} key={reg.id}>
                    <Card
                      sx={{
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 16px rgba(52, 152, 219, 0.3)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: 2,
                              background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <School sx={{ color: "white" }} />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Chip
                              label={reg.module.code}
                              size="small"
                              sx={{
                                bgcolor: "rgba(52, 152, 219, 0.2)",
                                color: "#3498db",
                                fontWeight: 700,
                                mb: 0.5,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                              {reg.module.name}
                            </Typography>
                            {reg.module.mnc && (
                              <Chip
                                label="MNC"
                                size="small"
                                sx={{
                                  bgcolor: "rgba(241, 196, 15, 0.2)",
                                  color: "#f1c40f",
                                  fontSize: 10,
                                  height: 18,
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </App>
  );
}

export default StudentInspect;
