import { createTheme } from '@mui/material/styles';
import { lightThemeColors } from './lightThemeColor';
import { darkThemeColors } from './darkThemeColor';
import { typographyConfig } from './typographyConfig';

export const createLightTheme = () => {
  return createTheme({
    palette: lightThemeColors.palette,
    typography: {
      ...typographyConfig,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: lightThemeColors.palette.background.default,
            color: lightThemeColors.palette.text.primary,
          },
        },
      },
    },
  });
};

export const createDarkTheme = () => {
  return createTheme({
    palette: darkThemeColors.palette,
    typography: {
      ...typographyConfig,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        xxl: 2560,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkThemeColors.palette.background.default,
            color: darkThemeColors.palette.text.primary,
          },
        },
      },
    },
  });
};

export const lightTheme = createLightTheme();
export const darkTheme = createDarkTheme();
