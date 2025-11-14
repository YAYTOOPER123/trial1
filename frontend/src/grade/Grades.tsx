import React from "react";
import axios from "axios";
import { Breadcrumbs, Link, Typography, Alert, Grid } from "@mui/material";
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

function GradeRow(props: { grade: Grade }) {
  const { grade } = props;

  return (
    <Grid key={grade.id} container style={{ padding: "10px 0" }}>
      <Grid item xs={4}>
        {grade.student &&
          `${grade.student.firstName} ${grade.student.lastName} (${grade.student.id})`}
      </Grid>
      <Grid item xs={4}>
        {grade.module && `${grade.module.code} ${grade.module.name}`}
      </Grid>
      <Grid item xs={4}>
        {grade.score}
      </Grid>
    </Grid>
  );
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

  return (
    <App>
      <Breadcrumbs sx={{ marginBottom: "30px" }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography sx={{ color: "text.primary" }}>Grades</Typography>
      </Breadcrumbs>
      {error && <Alert color="error">{error}</Alert>}
      {!error && grades.length < 1 && <Alert color="warning">No grades</Alert>}
      {grades.length > 0 && (
        <>
          <Grid container style={{ padding: "10px 0" }}>
            <Grid item xs={4}>
              Student
            </Grid>
            <Grid item xs={4}>
              Module
            </Grid>
            <Grid item xs={4}>
              Score
            </Grid>
          </Grid>
          {grades.map((g) => {
            return <GradeRow grade={g} key={g.id} />;
          })}
        </>
      )}
      <br />
      <br />
      <AddGrade update={updateGrades} />
    </App>
  );
}

export default Grades;
