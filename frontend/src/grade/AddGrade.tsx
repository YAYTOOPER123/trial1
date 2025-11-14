import React from "react";
import axios from "axios";
import {
  Card,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  Alert,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import {
  AddGradeBody,
  EntityModelStudent,
  EntityModelModule,
} from "../api/index";
import { API_ENDPOINT } from "../config";

function AddGrade(props: { update: Function }) {
  const [grade, setGrade] = React.useState<AddGradeBody>({});
  const [students, setStudents] = React.useState<EntityModelStudent[]>([]);
  const [modules, setModules] = React.useState<EntityModelModule[]>([]);
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => setError(error.message));

    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => setModules(response.data))
      .catch((error) => setError(error.message));
  }, []);

  function request() {
    setError(undefined);
    setSuccess(false);
    axios
      .post(`${API_ENDPOINT}/grades/addGrade`, grade)
      .then(() => {
        setSuccess(true);
        setGrade({});
        props.update();
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <Card sx={{
      padding: "30px",
      borderRadius: 3,
      position: "sticky",
      top: 20,
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <AddCircle sx={{ color: "white" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Add Grade</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Student</InputLabel>
          <Select
            value={grade.student_id ?? ""}
            onChange={(e) => setGrade({ ...grade, student_id: e.target.value })}
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
            value={grade.module_code ?? ""}
            onChange={(e) => setGrade({ ...grade, module_code: e.target.value })}
            label="Module"
          >
            {modules.map((m) => (
              <MenuItem key={m.code} value={m.code}>
                {`${m.code} - ${m.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Score"
          type="number"
          value={grade.score ?? ""}
          variant="outlined"
          inputProps={{ min: 0, max: 100 }}
          onChange={(e) => setGrade({ ...grade, score: e.target.value })}
        />

        <Button
          variant="contained"
          onClick={request}
          fullWidth
          size="large"
          sx={{
            background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
            color: "white",
            fontWeight: 700,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(135deg, #F57C00 0%, #E65100 100%)",
            },
          }}
        >
          Add Grade
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          Grade added successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
    </Card>
  );
}

export default AddGrade;
