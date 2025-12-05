import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import {
  PlusSignIcon,
  PreferenceHorizontalIcon,
  FavouriteIcon,
  BubbleChatIcon,
  SentIcon,
  AllBookmarkIcon
} from "hugeicons-react";

const Home = () => {

  const theme = useTheme();

  const Data = [
    {
      id: 1,
      name: 'Parth Sagar',
      hasStory: true
    },
    {
      id: 2,
      name: 'Parth fdgdg Sagar',
      hasStory: true
    },
    {
      id: 3,
      name: 'Pakgmnsjfdnrth Sagar',
      hasStory: true
    },
    {
      id: 4,
      name: 'Pfdgmkkarth Sagar',
      hasStory: true
    },
  ]

  const storiess = [
    { id: 1, name: "Adam", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", hasStory: true },
    { id: 2, name: "Sarah", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop", hasStory: true },
    { id: 3, name: "John", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop", hasStory: true },
  ];

  const posts = [
    // Base Item 1
    {
      id: 1,
      user: { name: "heaven.is.nevaeh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1500",
      likes: 35,
      caption: "Your favorite duo 💕",
    },
    // Base Item 2
    {
      id: 2,
      user: { name: "kyia_kayaks", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100" },
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1500",
      likes: 120,
      caption: "Feeling the summer breeze.",
    },
    // Base Item 3
    {
      id: 3,
      user: { name: "travel_guide", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100" },
      image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=1500",
      likes: 580,
      caption: "Mountain views never disappoint.",
    },

    // Duplicates with new IDs and slightly adjusted data (4-6)
    {
      id: 4,
      user: { name: "creative_lens", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_3I9PTja7m32xGNAJXr1XPisVTtvg3t04g&s",
      likes: 900,
      caption: "Golden hour glow is everything ✨",
    },
    {
      id: 5,
      user: { name: "city_explorer", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3S84mdfNlPWhPuB3wDNznaU48MisOxuxKXQ&s",
      likes: 42,
      caption: "Road trip soundtrack on repeat.",
    },
    {
      id: 6,
      user: { name: "foodie_delights", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR33rtpnKBrZXu1Jx62HfQLMGj9OLMooBtxug&s",
      likes: 1200,
      caption: "Best brunch spot in town! 🍳",
    },

    // Duplicates with new IDs and slightly adjusted data (7-9)
    {
      id: 7,
      user: { name: "ocean_lover", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      image: "https://www.premiumwishes.com/wp-content/uploads/2025/06/1860.jpg",
      likes: 650,
      caption: "Salty hair, clear water. Pure happiness.",
    },
    {
      id: 8,
      user: { name: "bookworm_belle", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100" },
      image: "https://rukminim2.flixcart.com/image/480/640/xif0q/painting/h/t/p/14-1-dhoni-photo-frame-5-jog-craft-original-imagwdxmfyc9kd7y.jpeg?q=90",
      likes: 88,
      caption: "Lost in pages and coffee.",
    },
    {
      id: 9,
      user: { name: "tech_trends", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgjVhYonxULUABf65DuMT-2tI4O6pS8HALoWqrW9KRcGis6BeijgH2pPXcfYvqRBI_BRo&usqp=CAU",
      likes: 240,
      caption: "New setup who dis? 💻",
    },

    // Duplicates with new IDs and slightly adjusted data (10-12)
    {
      id: 10,
      user: { name: "art_gallery", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      image: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_60/lsci/db/PICTURES/CMS/401100/401105.jpg",
      likes: 1500,
      caption: "Finding inspiration in every corner.",
    },
    {
      id: 11,
      user: { name: "fitness_first", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8MFYrhLD_fqK3cYUEP_aeMGwQfwsyvHPt6Q&s",
      likes: 350,
      caption: "One workout closer to my goal 💪",
    },
    {
      id: 12,
      user: { name: "nature_walks", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100" },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8MFYrhLD_fqK3cYUEP_aeMGwQfwsyvHPt6Q&s",
      likes: 95,
      caption: "Puppy therapy is the best kind of therapy.",
    },
  ];

  // ------------------ POST CARD COMPONENT ------------------
  const PostCard = ({ post }) => {
    const isDark = theme.palette.mode === "dark";

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'background.paper',
          borderRadius: { xs: 2, sm: 2, md: 2 },
          border: `1px solid divider`,
          overflow: 'hidden',
          mb: 0,
          p: 0,
          boxShadow: isDark
            ? "0 6px 16px rgba(20, 20, 20, 0.6)"
            : "0 6px 16px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 1.2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar src={post.user.avatar} sx={{ width: 34, height: 34 }} />
            <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{post.user.name}</Typography>
          </Box>

          <IconButton size="medium">
            <PreferenceHorizontalIcon size={20} strokeWidth={2} />
          </IconButton>
        </Box>

        {/* Post Image */}
        <Box
          component="img"
          src={post.image}
          alt="Post"
          sx={{
            width: "100%",
            height: { xs: 450, sm: 500, md: 500 },
            objectFit: "cover",
          }}
        />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, pt: 0 }}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton><FavouriteIcon size={22} strokeWidth={2} /></IconButton>
            <IconButton><BubbleChatIcon size={22} strokeWidth={2} /></IconButton>
            <IconButton><SentIcon size={22} strokeWidth={2} /></IconButton>
          </Box>
          <IconButton><AllBookmarkIcon size={22} strokeWidth={2} /></IconButton>
        </Box>

        {/* Likes */}
        <Box sx={{ px: 2, pt: 0.5 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
            Liked by <b>kyia_kayaks</b> and {post.likes} others
          </Typography>
        </Box>

        {/* Caption */}
        <Box sx={{ px: 2, pt: 0.5, pb: 1 }}>
          <Typography sx={{ fontSize: 14 }}>
            <b>{post.user.name}</b> {post.caption}
          </Typography>
        </Box>

        <Divider />
        <Typography sx={{ px: 2, py: 1, fontSize: 12, color: "text.secondary" }}>
          View all 50 comments
        </Typography>

      </Box>
    );
  };

  // ------------------ MAIN HOME UI ------------------
  return (
    <Box sx={{ py: 2, px: { xs: 2, md: 3 }, width: "100%", height: '100vh' }}>
      {/* STORIES */}
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 1, display: { md: "block", xs: "none" } }}>
        Stories
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* Your Story */}
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ position: "relative", width: 70, height: 70 }}>
            <Avatar sx={{ width: 60, height: 60 }} src={storiess[0].image} />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlusSignIcon size={14} color="#fff" />
            </Box>
          </Box>
          <Typography sx={{ fontSize: 13 }}>Your Story</Typography>
        </Box>

        {/* Other Stories */}
        {storiess.map((story) => (
          <Box key={story.id} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                padding: "3px",
                background:
                  "conic-gradient(#BB1D08, #0868F8, #FD3A8F, #EC0F0F, #F5E0E0)",
              }}
            >
              <Avatar
                src={story.image}
                sx={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Typography sx={{ fontSize: 13 }}>{story.name}</Typography>
          </Box>
        ))}
      </Box>

      {/* FEED TITLE */}
      <Typography sx={{ fontSize: 26, fontWeight: 600, mb: 2, display: { md: "block", xs: "none" } }}>
        Your Feed
      </Typography>

      {/* CENTERED GRID FEED */}
      <Box sx={{ width: '100%', height: '100vh' }}>
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
