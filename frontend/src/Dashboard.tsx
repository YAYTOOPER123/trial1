import React from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Avatar, Chip, Paper } from "@mui/material";
import { TrendingUp, Person, School, Grade as GradeIcon, EmojiEvents } from "@mui/icons-material";
import App from "./App";
import { API_ENDPOINT } from "./config";

interface Grade {
  id: number;
  score: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
  module: {
    code: string;
    name: string;
    mnc: boolean;
  };
}

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

function Dashboard() {
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      axios.get(`${API_ENDPOINT}/grades`).catch(() => ({ data: [] })),
      axios.get(`${API_ENDPOINT}/students`).catch(() => ({ data: [] })),
      axios.get(`${API_ENDPOINT}/modules`).catch(() => ({ data: [] })),
    ])
      .then(([gradesRes, studentsRes, modulesRes]) => {
        setGrades(Array.isArray(gradesRes.data) ? gradesRes.data : []);
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        setModules(Array.isArray(modulesRes.data) ? modulesRes.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
        setLoading(false);
      });
  }, []);

  const averageGPA = React.useMemo(() => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, g) => sum + g.score, 0);
    return (total / grades.length).toFixed(1);
  }, [grades]);

  const topPerformers = React.useMemo(() => {
    const studentScores = new Map<number, { student: Student; scores: number[] }>();

    grades.forEach((g) => {
      if (!studentScores.has(g.student.id)) {
        studentScores.set(g.student.id, { student: g.student, scores: [] });
      }
      studentScores.get(g.student.id)!.scores.push(g.score);
    });

    const averages = Array.from(studentScores.values())
      .map(({ student, scores }) => ({
        student,
        average: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);

    return averages;
  }, [grades]);

  const recentGrades = React.useMemo(() => {
    return [...grades].slice(-5).reverse();
  }, [grades]);

  function getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  }

  function getAvatarColor(id?: number): string {
    const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"];
    return colors[(id ?? 0) % colors.length];
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return "#2ecc71";
    if (score >= 80) return "#3498db";
    if (score >= 70) return "#f39c12";
    if (score >= 60) return "#e67e22";
    return "#e74c3c";
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

  return (
    <App>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: 900,
            mb: 1,
            textShadow: "0 4px 12px rgba(0,0,0,0.3)",
            letterSpacing: "-0.5px",
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Overview of your academic performance
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                  Total Students
                </Typography>
                <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                  Modules
                </Typography>
                <School sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {modules.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                  Total Grades
                </Typography>
                <GradeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {grades.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              borderRadius: 3,
              transition: "transform 0.3s ease",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9 }}>
                  Average Score
                </Typography>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {averageGPA}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
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
              <EmojiEvents sx={{ fontSize: 32, color: "#f39c12", mr: 2 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                Top Performers
              </Typography>
            </Box>
            {topPerformers.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 4 }}>
                No performance data yet
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {topPerformers.map((performer, index) => (
                  <Box
                    key={performer.student.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255,255,255,0.1)",
                        transform: "translateX(8px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: index === 0 ? "#f39c12" : index === 1 ? "#95a5a6" : "#cd7f32",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: getAvatarColor(performer.student.id),
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(performer.student.firstName, performer.student.lastName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
                        {performer.student.firstName} {performer.student.lastName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                        {performer.student.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${performer.average.toFixed(1)}%`}
                      sx={{
                        bgcolor: `${getScoreColor(performer.average)}33`,
                        color: getScoreColor(performer.average),
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
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
              <GradeIcon sx={{ fontSize: 32, color: "#3498db", mr: 2 }} />
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                Recent Activity
              </Typography>
            </Box>
            {recentGrades.length === 0 ? (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 4 }}>
                No recent grades
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentGrades.map((grade) => (
                  <Box
                    key={grade.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 45,
                        height: 45,
                        bgcolor: getAvatarColor(grade.student.id),
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {getInitials(grade.student.firstName, grade.student.lastName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ color: "white", fontWeight: 600, mb: 0.5 }}>
                        {grade.student.firstName} {grade.student.lastName}
                      </Typography>
                      <Chip
                        label={grade.module.code}
                        size="small"
                        sx={{
                          bgcolor: "rgba(52, 152, 219, 0.2)",
                          color: "#3498db",
                          fontSize: 11,
                          height: 20,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        minWidth: 60,
                        height: 60,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${getScoreColor(grade.score)} 0%, ${getScoreColor(grade.score)}dd 100%)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 4px 12px ${getScoreColor(grade.score)}44`,
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                        {grade.score}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: 9, opacity: 0.9 }}>
                        /100
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </App>
  );
}

export default Dashboard;
