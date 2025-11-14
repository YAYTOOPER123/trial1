import { Box, Typography, Card, CardContent, Grid, CardActionArea } from "@mui/material";
import { School, Person, Grade as GradeIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import App from "./App";

function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Modules",
      description: "Manage course modules and curriculum",
      icon: <School sx={{ fontSize: 60 }} />,
      path: "/modules",
      color: "#4CAF50",
    },
    {
      title: "Students",
      description: "View and manage student information",
      icon: <Person sx={{ fontSize: 60 }} />,
      path: "/students",
      color: "#2196F3",
    },
    {
      title: "Grades",
      description: "Track and record student grades",
      icon: <GradeIcon sx={{ fontSize: 60 }} />,
      path: "/grades",
      color: "#FF9800",
    },
  ];

  return (
    <App>
      <Box sx={{ textAlign: "center", mb: 6, mt: 4 }}>
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: 800,
            mb: 2,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Welcome to Grade Manager
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)" }}>
          Your comprehensive student management solution
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card
              sx={{
                height: "100%",
                background: "white",
                borderRadius: 4,
                transition: "all 0.3s ease-in-out",
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
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
                  transform: "translateY(-10px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
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
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: card.color }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
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
