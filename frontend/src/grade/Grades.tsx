import React from "react";
import axios from "axios";
import { Typography, Alert, Grid, Card, CardContent, Box, Chip, Avatar } from "@mui/material";
import { Grade as GradeIcon, EmojiEvents, School, Person } from "@mui/icons-material";
import App from "../App.tsx";
import { API_ENDPOINT } from "../config";
import AddGrade from "./AddGrade";

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

function Grades() {
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateGrades();
  }, []);

  function updateGrades() {
    axios
      .get(`${API_ENDPOINT}/grades`)
      .then((response) => {
        setGrades(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return "#4CAF50";
    if (score >= 80) return "#8BC34A";
    if (score >= 70) return "#FFC107";
    if (score >= 60) return "#FF9800";
    return "#FF5722";
  }

  function getScoreLabel(score: number): string {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Pass";
    return "Needs Improvement";
  }

  function getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  }

  function getAvatarColor(id?: number): string {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];
    return colors[(id ?? 0) % colors.length];
  }

  return (
    <App>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
          Grades
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Track and manage student performance
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {!error && grades.length < 1 && (
            <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
              <GradeIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No grades yet</Typography>
              <Typography variant="body2" color="text.secondary">Add your first grade to get started</Typography>
            </Card>
          )}

          <Grid container spacing={2}>
            {grades.map((g, index) => (
              <Grid item xs={12} key={g.id}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: "1 1 300px" }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: getAvatarColor(g.student.id),
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(g.student.firstName, g.student.lastName)}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Person sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {g.student.firstName} {g.student.lastName}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            ID: {g.student.id}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: "1 1 250px" }}>
                        <School sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Box>
                          <Chip
                            label={g.module.code}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                              color: "white",
                              mb: 0.5,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {g.module.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: "center", flex: "0 0 120px" }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${getScoreColor(g.score)} 0%, ${getScoreColor(g.score)}dd 100%)`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            margin: "0 auto",
                            boxShadow: `0 4px 12px ${getScoreColor(g.score)}44`,
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
                            {g.score}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: 10 }}>
                            / 100
                          </Typography>
                        </Box>
                        <Chip
                          icon={g.score >= 80 ? <EmojiEvents /> : undefined}
                          label={getScoreLabel(g.score)}
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: `${getScoreColor(g.score)}22`,
                            color: getScoreColor(g.score),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AddGrade update={updateGrades} />
        </Grid>
      </Grid>
    </App>
  );
}

export default Grades;
