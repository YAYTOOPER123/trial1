import { Container, Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { School, Home as HomeIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

function App(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <AppBar position="static" elevation={0} sx={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
        <Toolbar>
          <School sx={{ mr: 2, color: "white" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white", fontWeight: 700 }}>
            Student Grade Manager
          </Typography>
          {location.pathname !== "/" && (
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ color: "white" }}
            >
              Home
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {props.children}
      </Container>
    </Box>
  );
}

export default App;
