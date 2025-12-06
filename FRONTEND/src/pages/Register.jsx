import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useTheme } from '../hooks/useTheme'
import Logo from '../assets/StoryDeck.svg'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import {
  GoogleIcon,
  Facebook01Icon,
  EyeIcon,
  TransitionRightIcon
} from "hugeicons-react";
import axiosInstance from '../api/axiosInstance';
import { useToast } from '../components/Toast/useToast';

const Register = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'agreeToTerms' ? checked : value,
    }))
    if (error) setError('')
  }

  const handlePasswordVisibilityToggle = () => {
    setShowPassword((prev) => !prev)
  }

  const handleConfirmPasswordVisibilityToggle = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service')
      return false
    }
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSubmitDisabled(true)

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }

      const response = await axiosInstance.post('api/auth/register', payload);
      if (response.status === 201) {
        showSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Username  is already registered');
        showError('Username is already registered');
      } else if (err.response?.status === 400) {
        setError('Email is already registered');
        showError('Email is already registered');
      }
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  }


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="xxl">
        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: 'none',
            backgroundImage: 'none',
            p: 4,
            width: '100%',
            maxWidth: 480,
            minWidth: { xs: '280px', sm: '360px', md: '420px' },
            mx: 'auto',
            boxShadow: 0,
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 2,
              }}
            >
               <img src={Logo} alt='StoryDeck' width={50} />
              <Typography
                sx={{
                  fontSize: 35
                }}
              >
                STORYDECK
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 1 }}
            >
              Sign up to see photos and videos from your friends.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', width: '100%', gap: 1, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin("Google")}
              startIcon={<GoogleIcon size={22} strokeWidth={2} />}
              sx={{
                borderRadius: 1,
                backgroundColor: "transparent",
                color: "text.primary",
                borderStyle: "dashed",
                borderWidth: "1px",
                borderColor: "divider",
                fontWeight: 500,
                textTransform: "none",
                py: 1.2,
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialLogin('Facebook')}
              startIcon={<Facebook01Icon size={22} strokeWidth={2} />}
              sx={{
                borderRadius: 1,
                backgroundColor: "transparent",
                color: "text.primary",
                borderStyle: "dashed",
                borderWidth: "1px",
                borderColor: "divider",
                fontWeight: 500,
                textTransform: "none",
                py: 1.2,
              }}
            >
              Facebook
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Registration Form */}
          <form onSubmit={handleRegister}>

            <TextField
              fullWidth
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'none',
                  borderRadius: 1,
                  fontSize: 16,
                },
              }}
            />

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'none',
                  borderRadius: 1,
                  fontSize: 16,
                },
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'none',
                  borderRadius: 1,
                  fontSize: 16,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handlePasswordVisibilityToggle}
                      edge="end"
                      aria-label={showPassword ? <VisibilityOffOutlinedIcon /> : <EyeIcon />}
                      size="small"
                    >
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  borderRadius: 1,
                  fontSize: 16,
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              margin="dense"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleConfirmPasswordVisibilityToggle}
                      edge="end"
                      aria-label={showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <EyeIcon />}
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  borderRadius: 1,
                  fontSize: 16,
                },
              }}
            />


            {/* Terms Agreement */}
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link
                    href="#"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link
                    href="#"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ my: 2 }}
            />

            {/* Register Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              startIcon={<TransitionRightIcon />}
              sx={{
                fontWeight: 400,
                letterSpacing: 1,
                borderRadius: 1,
                mb: 0,
                backgroundColor: 'primary.main',
              }}
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link
                onClick={() => navigate('/login')}
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}

export default Register
