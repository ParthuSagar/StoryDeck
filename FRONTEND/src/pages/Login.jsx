import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/StoryDeck.svg'
import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  Link
} from '@mui/material';
import Logo from '../assets/StoryDeck.svg'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import {
  GoogleIcon,
  Facebook01Icon,
  EyeIcon,
  TransitionRightIcon
} from "hugeicons-react";

import { saveAuthTokens, saveUserData } from '../utils/authUtils';
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../components/Toast/useToast';


const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
    if (error) setError('');
  };

  // Toggle password visibility
  const handlePasswordVisibilityToggle = () => {
    setShowPassword((prev) => !prev);
  };

  // Login form submit
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setSubmitDisabled(true);
    setError('');

    try {
      const res = await axiosInstance.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        saveAuthTokens({ access: token.access, refresh: token.refresh });
        saveUserData(user);
        showSuccess('Login successful! Redirecting... ');

        setTimeout(() => {
          navigate('/'); // redirect after login
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('No account found with this email');
        showError('No account found with this email');
      } else if (err.response?.status === 400) {
        setError('Invalid credentials. Please try again.');
        showError('Invalid credentials. Please try again.');
      } else {
        setError('An unexpected error occurred');
        showError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };

  // Social login buttons
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        py: 1,
        px: 1,
      }}
    >
      <Container maxWidth="xxl">
        <Card
          sx={{
            borderRadius: 2,
            p: 1,
            maxWidth: 480,
            mx: 'auto',
            boxShadow: 0,
            backgroundImage: 'none',
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
              <img src={Logo} alt='StoryDeck' width={50} />
              <Typography sx={{ fontSize: 35 }}>STORYDECK</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Welcome back! Sign in to your account
            </Typography>
          </Box>

          {/* Error */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Social login buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              fullWidth
              type="button" // important! prevents form submit
              variant="outlined"
              startIcon={<GoogleIcon size={22} />}
              sx={{ borderStyle: 'dashed', borderColor: 'divider', textTransform: 'none' }}
              onClick={() => handleSocialLogin('Google')}
            >
              Google
            </Button>

            <Button
              fullWidth
              type="button" // important! prevents form submit
              variant="outlined"
              startIcon={<Facebook01Icon size={22} />}
              sx={{ borderStyle: 'dashed', borderColor: 'divider', textTransform: 'none' }}
              onClick={() => handleSocialLogin('Facebook')}
            >
              Facebook
            </Button>
          </Box>

          {/* Login form */}
          <form onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="dense"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handlePasswordVisibilityToggle}
                      size="small"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <EyeIcon size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember + Forgot */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                }
                label={
                  <Typography variant="body2">Remember me</Typography>
                }
              />

              <Link
                onClick={() => navigate('/register')}
                sx={{
                  fontSize: 14,
                  color: 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  ':hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Login button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={submitDisabled || loading}
              startIcon={<TransitionRightIcon />}
              sx={{ borderRadius: 1, fontWeight: 500 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Sign Up */}
          <Typography textAlign="center" variant="body2">
            Don't have an account?{' '}
            <Link
              onClick={() => navigate('/register')}
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign Up here
            </Link>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
