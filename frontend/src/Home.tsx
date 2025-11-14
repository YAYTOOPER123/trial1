import { Box, Typography, Card, CardContent, Grid, CardActionArea } from "@mui/material";
import { School, Person, Grade as GradeIcon, Dashboard as DashboardIcon, AppRegistration } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import App from "./App";

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Dashboard",
      description: "View analytics and recent activity",
      icon: <DashboardIcon sx={{ fontSize: 60 }} />,
      path: "/dashboard",
      color: "#3498db",
    },
    {
      title: "Students",
      description: "View and manage student information",
      icon: <Person sx={{ fontSize: 60 }} />,
      path: "/students",
      color: "#9b59b6",
    },
    {
      title: "Modules",
      description: "Manage course modules and curriculum",
      icon: <School sx={{ fontSize: 60 }} />,
      path: "/modules",
      color: "#2ecc71",
    },
    {
      title: "Registrations",
      description: "Register students for modules",
      icon: <AppRegistration sx={{ fontSize: 60 }} />,
      path: "/registrations",
      color: "#e67e22",
    },
    {
      title: "Grades",
      description: "Track and record student grades",
      icon: <GradeIcon sx={{ fontSize: 60 }} />,
      path: "/grades",
      color: "#e74c3c",
    },
  ];

  return (
    <App>
      <Box sx={{ textAlign: "center", mb: 6, mt: 4 }}>
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: 900,
            mb: 2,
            textShadow: "0 4px 12px rgba(0,0,0,0.4)",
            letterSpacing: "-1px",
          }}
        >
          Welcome to GradeHub
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
          Your modern student management solution
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                animation: `slideIn 0.6s ease-out ${index * 0.1}s both`,
                "@keyframes slideIn": {
                  from: {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
                "&:hover": {
                  transform: "translateY(-12px) scale(1.02)",
                  boxShadow: `0 20px 40px ${card.color}44`,
                  border: `1px solid ${card.color}66`,
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <CardActionArea onClick={() => navigate(card.path)} sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      mb: 3,
                      boxShadow: `0 8px 20px ${card.color}44`,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "white" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </App>
  );
}

export default Home;
