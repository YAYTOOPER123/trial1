import React from "react";
import axios from "axios";
import {
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Grade as GradeIcon, EmojiEvents, School, Person, Edit, Delete } from "@mui/icons-material";
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

interface Module {
  code: string;
  name: string;
  mnc: boolean;
}

function Grades() {
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [modules, setModules] = React.useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = React.useState<string>("");
  const [error, setError] = React.useState<string>();
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedGrade, setSelectedGrade] = React.useState<Grade | null>(null);
  const [editScore, setEditScore] = React.useState<number>(0);

  React.useEffect(() => {
    updateGrades();
    loadModules();
  }, []);

  function loadModules() {
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        setModules(response.data);
      })
      .catch((err) => {
        console.error("Error loading modules:", err);
      });
  }

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

  const filteredGrades = React.useMemo(() => {
    if (!selectedModule) return grades;
    return grades.filter((g) => g.module.code === selectedModule);
  }, [selectedModule, grades]);

  function handleEditClick(grade: Grade) {
    setSelectedGrade(grade);
    setEditScore(grade.score);
    setEditDialogOpen(true);
  }

  function handleDeleteClick(grade: Grade) {
    setSelectedGrade(grade);
    setDeleteDialogOpen(true);
  }

  function handleEditSave() {
    if (!selectedGrade) return;
    if (editScore < 0 || editScore > 100) {
      setError("Score must be between 0 and 100");
      return;
    }

    axios
      .put(`${API_ENDPOINT}/grades/${selectedGrade.id}`, { score: editScore })
      .then(() => {
        updateGrades();
        setEditDialogOpen(false);
        setSelectedGrade(null);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to update grade";
        setError(errorMsg);
      });
  }

  function handleDeleteConfirm() {
    if (!selectedGrade) return;

    axios
      .delete(`${API_ENDPOINT}/grades/${selectedGrade.id}`)
      .then(() => {
        updateGrades();
        setDeleteDialogOpen(false);
        setSelectedGrade(null);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to delete grade";
        setError(errorMsg);
      });
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
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ background: "white", borderRadius: 2 }}>
              <InputLabel>Filter by Module</InputLabel>
              <Select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                label="Filter by Module"
              >
                <MenuItem value="">All Modules</MenuItem>
                {modules.map((m) => (
                  <MenuItem key={m.code} value={m.code}>
                    {`${m.code} - ${m.name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {!error && filteredGrades.length < 1 && (
            <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
              <GradeIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No grades yet</Typography>
              <Typography variant="body2" color="text.secondary">Add your first grade to get started</Typography>
            </Card>
          )}

          <Grid container spacing={2}>
            {filteredGrades.map((g, index) => (
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

                      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(g)}
                          sx={{
                            bgcolor: "rgba(52, 152, 219, 0.1)",
                            "&:hover": { bgcolor: "rgba(52, 152, 219, 0.2)" },
                          }}
                        >
                          <Edit sx={{ fontSize: 18, color: "#3498db" }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(g)}
                          sx={{
                            bgcolor: "rgba(231, 76, 60, 0.1)",
                            "&:hover": { bgcolor: "rgba(231, 76, 60, 0.2)" },
                          }}
                        >
                          <Delete sx={{ fontSize: 18, color: "#e74c3c" }} />
                        </IconButton>
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

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Grade</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Score"
              type="number"
              value={editScore}
              onChange={(e) => setEditScore(parseInt(e.target.value))}
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Grade</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this grade for{" "}
            <strong>
              {selectedGrade?.student.firstName} {selectedGrade?.student.lastName}
            </strong>{" "}
            in <strong>{selectedGrade?.module.code}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </App>
  );
}

export default Grades;
