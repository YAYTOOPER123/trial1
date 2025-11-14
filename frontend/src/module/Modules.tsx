import React from "react";
import axios from "axios";
import { Typography, Alert, Grid, Card, CardContent, Chip, Box } from "@mui/material";
import { School, CheckCircle, Cancel } from "@mui/icons-material";
import App from "../App.tsx";
import { EntityModelModule } from "../api/entityModelModule.ts";
import { API_ENDPOINT } from "../config";
import AddModule from "./AddModule";

function Modules() {
  const [modules, setModules] = React.useState<EntityModelModule[]>([]);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    updateModules();
  }, []);

  function updateModules() {
    axios
      .get(`${API_ENDPOINT}/modules`)
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <App>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
          Modules
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Manage your course modules and curriculum
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {!error && modules.length < 1 && (
            <Card sx={{ borderRadius: 3, p: 4, textAlign: "center" }}>
              <School sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No modules yet</Typography>
              <Typography variant="body2" color="text.secondary">Add your first module to get started</Typography>
            </Card>
          )}

          <Grid container spacing={2}>
            {modules.map((m, index) => (
              <Grid item xs={12} md={6} key={m.code}>
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
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <School sx={{ color: "white" }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Chip
                          label={m.code}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {m.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      {m.mnc ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="MNC Module"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<Cancel />}
                          label="Regular Module"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <AddModule update={updateModules} />
        </Grid>
      </Grid>
    </App>
  );
}

export default Modules;
