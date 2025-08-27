import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { WebshopProvider } from './context/WebshopContext';
import Login from './components/Login';
import ShopPage from './components/ShopPage';
import Checkout from './components/Checkout';
import OrderSummary from './components/OrderSummary';

// Create an elegant Material Design theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Deep Navy Blue
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#fff',
    },
    secondary: {
      main: '#64748b', // Warm Silver Grey
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#fff',
    },
    background: {
      default: '#f8fafc', // Light grey background
      paper: '#ffffff', // White paper
    },
    text: {
      primary: '#1e293b', // Dark navy text
      secondary: '#0891b2', // Elegant teal accent
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(30,58,138,0.08)',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(8,145,178,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(30,58,138,0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebshopProvider>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" elevation={2}>
              <Toolbar>
                <ShoppingCartIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Fake Webshop
                </Typography>
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<ShopPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Checkout />} />
                <Route path="/order-summary/:orderId" element={<OrderSummary />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </WebshopProvider>
    </ThemeProvider>
  );
};

export default App;
