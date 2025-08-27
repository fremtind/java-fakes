import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import { useWebshop } from '../context/WebshopContext';
import { login, createCart } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const { setUserEmail, setCart } = useWebshop();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            // Login
            await login(email);

            // Create cart for the user
            const cart = await createCart(email);

            // Update context
            setUserEmail(email);
            setCart(cart as any);
            setError(null);
            // Redirect to cart page
            navigate('/cart');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    mx: 2,
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <PersonOutline
                            sx={{
                                fontSize: 48,
                                color: 'primary.main',
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            color="primary"
                            textAlign="center"
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Sign in to access your shopping cart
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                            margin="normal"
                            autoComplete="email"
                            autoFocus
                            sx={{ mb: 2 }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
