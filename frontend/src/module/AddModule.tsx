import React from "react";
import axios from "axios";
import {
  Card,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { EntityModelModule } from "../api/entityModelModule.ts";
import { API_ENDPOINT } from "../config";

function AddModule(props: { update: Function }) {
  const [module, setModule] = React.useState<EntityModelModule>({});
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState(false);

  function request() {
    setError(undefined);
    setSuccess(false);
    axios
      .post(`${API_ENDPOINT}/modules/add`, module)
      .then(() => {
        setSuccess(true);
        setModule({});
        props.update();
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((response) => {
        setError(response.message);
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
            background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Add sx={{ color: "white" }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Add Module</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Module Code"
          value={module.code ?? ""}
          variant="outlined"
          onChange={(e) => {
            setModule({ ...module, code: e.target.value.toUpperCase() });
          }}
        />
        <TextField
          fullWidth
          label="Module Name"
          value={module.name ?? ""}
          variant="outlined"
          onChange={(e) => {
            setModule({ ...module, name: e.target.value });
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={module.mnc ?? false}
              onChange={(e) => {
                setModule({ ...module, mnc: e.target.checked });
              }}
              color="success"
            />
          }
          label="MNC Module?"
        />
        <Button
          variant="contained"
          onClick={request}
          fullWidth
          size="large"
          sx={{
            background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
            color: "white",
            fontWeight: 700,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
            },
          }}
        >
          Add Module
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
          Module added successfully!
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

export default AddModule;
