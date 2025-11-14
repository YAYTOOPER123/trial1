import { Container, Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { School, Home as HomeIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

function App(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(41, 128, 185, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(52, 152, 219, 0.1) 0%, transparent 50%)",
        pointerEvents: "none",
      }
    }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(26, 26, 46, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Toolbar>
          <School sx={{ mr: 2, color: "#3498db", fontSize: 32 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, color: "white", fontWeight: 800, letterSpacing: 0.5 }}>
            GradeHub
          </Typography>
          {location.pathname !== "/" && (
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(52, 152, 219, 0.2)",
                  transform: "translateY(-2px)",
                }
              }}
            >
              Dashboard
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4, position: "relative", zIndex: 1 }}>
        {props.children}
      </Container>
    </Box>
  );
}

export default App;
