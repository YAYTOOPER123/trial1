import React from "react";
import axios from "axios";
import { Typography, Alert, Grid, Card, CardContent, Chip, Box, Avatar } from "@mui/material";
import { Person, Email, AccountCircle } from "@mui/icons-material";
import App from "../App.tsx";
import { EntityModelStudent } from "../api/index";
import { API_ENDPOINT } from "../config";
import AddStudent from "./AddStudent";

function Students() {
  const [students, setStudents] = React.useState<EntityModelStudent[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateStudents();
  }, []);

  function updateStudents() {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((response) => {
        setError(response.message);
      });
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
          Students
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Manage student information and records
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {!error && students.length < 1 && (
            <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
              <Person sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No students yet</Typography>
              <Typography variant="body2" color="text.secondary">Add your first student to get started</Typography>
            </Card>
          )}

          <Grid container spacing={2}>
            {students.map((s, index) => (
              <Grid item xs={12} md={6} key={s.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "scale(0.95)" },
                      to: { opacity: 1, transform: "scale(1)" },
                    },
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: getAvatarColor(s.id),
                          fontSize: 24,
                          fontWeight: 700,
                          mr: 2,
                        }}
                      >
                        {getInitials(s.firstName, s.lastName)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {s.firstName} {s.lastName}
                        </Typography>
                        <Chip
                          label={`ID: ${s.id}`}
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccountCircle sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {s.username}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Email sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                          {s.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AddStudent update={updateStudents} />
        </Grid>
      </Grid>
    </App>
  );
}

export default Students;
