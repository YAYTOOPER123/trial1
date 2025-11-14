import React from "react";
import axios from "axios";
import { Card, TextField, Button, Typography, Alert, Box } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { EntityModelStudent } from "../api/entityModelStudent.ts";
import { API_ENDPOINT } from "../config";

function AddStudent(props: { update: Function }) {
  const [student, setStudent] = React.useState<EntityModelStudent>({});
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState(false);

  function request() {
    setError(undefined);
    setSuccess(false);
    axios
      .post(`${API_ENDPOINT}/students`, student)
      .then(() => {
        setSuccess(true);
        setStudent({});
        props.update();
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to add student";
        setError(errorMsg);
        console.error("Error adding student:", err.response?.data || err);
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
            background: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <PersonAdd sx={{ color: "white" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Add Student</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Student ID"
          type="number"
          value={student.id ?? ""}
          variant="outlined"
          onChange={(e) => {
            setStudent({ ...student, id: Number(e.target.value) });
          }}
        />
        <TextField
          fullWidth
          label="First Name"
          value={student.firstName ?? ""}
          variant="outlined"
          onChange={(e) => {
            setStudent({ ...student, firstName: e.target.value });
          }}
        />
        <TextField
          fullWidth
          label="Last Name"
          value={student.lastName ?? ""}
          variant="outlined"
          onChange={(e) => {
            setStudent({ ...student, lastName: e.target.value });
          }}
        />
        <TextField
          fullWidth
          label="Username"
          value={student.username ?? ""}
          variant="outlined"
          onChange={(e) => {
            setStudent({ ...student, username: e.target.value });
          }}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={student.email ?? ""}
          variant="outlined"
          onChange={(e) => {
            setStudent({ ...student, email: e.target.value });
          }}
        />
        <Button
          variant="contained"
          onClick={request}
          fullWidth
          size="large"
          sx={{
            background: "linear-gradient(135deg, #2196F3 0%, #1976d2 100%)",
            color: "white",
            fontWeight: 700,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            },
          }}
        >
          Add Student
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          Student added successfully!
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

export default AddStudent;
