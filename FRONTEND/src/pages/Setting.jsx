import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);

  const posts = [
    "/images/p1.jpg",
    "/images/p2.jpg",
    "/images/p3.jpg",
    "/images/p4.jpg",
    "/images/p5.jpg",
    "/images/p6.jpg",
  ];

  const reels = [
    "/images/r1.jpg",
    "/images/r2.jpg",
    "/images/r3.jpg",
  ];

  const feedback = [
    { username: "john_45", text: "Amazing content 🔥🔥", img: "/images/f1.jpg" },
    { username: "priya_k", text: "Love your UI skills ❤️", img: "/images/f2.jpg" },
    { username: "dev_master", text: "Clean work 👏", img: "/images/f3.jpg" },
  ];

  const highlights = [
    { title: "Travel", img: "/images/h1.jpg" },
    { title: "Food", img: "/images/h2.jpg" },
    { title: "Life", img: "/images/h3.jpg" },
    { title: "Gym", img: "/images/h4.jpg" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        p: 2,
      }}
    >
      {/* Profile Header */}
      <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 3 }}>
        <Avatar
          src="/images/profile.jpg"
          sx={{ width: 100, height: 100, border: "3px solid #d32f2f" }}
        />

        <Box>
          <Typography variant="h6" fontWeight={700}>
            parth_nanera
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
            <Box>
              <Typography fontWeight={700}>128</Typography>
              <Typography fontSize="14px" color="text.secondary">
                Posts
              </Typography>
            </Box>

            <Box>
              <Typography fontWeight={700}>14.6k</Typography>
              <Typography fontSize="14px" color="text.secondary">
                Followers
              </Typography>
            </Box>

            <Box>
              <Typography fontWeight={700}>322</Typography>
              <Typography fontSize="14px" color="text.secondary">
                Following
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: 2, textTransform: "none", mr: 1 }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Share Profile
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Bio */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600}>Parth Nanera</Typography>
        <Typography variant="body2">Frontend Developer • React.js</Typography>
        <Typography variant="body2">Love coding & building UI ✨</Typography>
      </Box>

      {/* Highlights */}
      <Typography fontWeight={600} mb={1}>
        Highlights
      </Typography>

      <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 1 }}>
        {highlights.map((item, idx) => (
          <MotionBox
            key={idx}
            whileHover={{ scale: 1.1 }}
            sx={{ textAlign: "center" }}
          >
            <Avatar
              src={item.img}
              sx={{
                width: 65,
                height: 65,
                border: "2px solid #e57373",
                margin: "auto",
              }}
            />
            <Typography fontSize="13px">{item.title}</Typography>
          </MotionBox>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        centered
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          mb: 2,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
        }}
      >
        <Tab label="Posts" />
        <Tab label="Reels" />
        <Tab label="Feedback" />
      </Tabs>

      {/* ---------------- TAB CONTENT ---------------- */}

      {/* POSTS TAB */}
      {tabValue === 0 && (
        <Grid container spacing={0.5}>
          {posts.map((img, i) => (
            <Grid item xs={4} key={i}>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                sx={{
                  height: 130,
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* REELS TAB */}
      {tabValue === 1 && (
        <Grid container spacing={1}>
          {reels.map((img, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <MotionBox
                whileHover={{ scale: 1.03 }}
                sx={{
                  height: 200,
                  borderRadius: 2,
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* FEEDBACK TAB */}
      {tabValue === 2 && (
        <Box sx={{ mt: 1 }}>
          {feedback.map((f, i) => (
            <MotionBox
              key={i}
              whileHover={{ scale: 1.01 }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mb: 1,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Avatar src={f.img} sx={{ width: 50, height: 50 }} />
              <Box>
                <Typography fontWeight={600}>{f.username}</Typography>
                <Typography fontSize="14px" color="text.secondary">
                  {f.text}
                </Typography>
              </Box>
            </MotionBox>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Settings;
