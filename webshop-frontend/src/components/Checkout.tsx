import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Chip,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    Payment as PaymentIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useWebshop } from '../context/WebshopContext';
import { confirmOrder } from '../services/api';
import ErrorBanner from './ErrorBanner';

const Checkout: React.FC = () => {
    const { cart, userEmail, error: contextError, setError, clearError } = useWebshop();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleConfirmOrder = async () => {
        console.log('handleConfirmOrder called');
        console.log('cart:', cart);
        console.log('userEmail:', userEmail);

        if (!cart || !userEmail) {
            console.log('Cart or userEmail is missing');
            return;
        }

        setLoading(true);
        try {
            console.log('Calling confirmOrder API...');
            const order = await confirmOrder(cart.id, userEmail);
            console.log('API call successful, full response:', order);
            console.log('Order ID:', order?.id);

            // Validate that we have a valid order with an ID
            if (!order || !order.id) {
                console.error('Invalid order response - missing ID:', order);
                setLocalError('Order confirmation failed: Invalid response from server');
                setError('Order confirmation failed: Invalid response from server');
                return;
            }

            setLocalError(null);
            clearError();

            // Navigate to order summary page
            console.log('Navigating to order summary with ID:', order.id);
            navigate(`/order-summary/${order.id}`);

            // Note: Cart will be cleared by the backend after successful order confirmation
            // No need to call clearCart() here as it causes re-render issues

        } catch (err) {
            console.error('API call failed:', err);
            setLocalError('Order confirmation failed. Please try again.');
            setError('Order confirmation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    console.log('Component render - cart:', cart);
    console.log('Component render - userEmail:', userEmail);

    const currentError = localError || contextError;

    if (!cart || !userEmail) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary">
                    Please ensure you have items in your cart and are logged in.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Order Confirmation
            </Typography>

            {currentError && (
                <ErrorBanner
                    message={currentError}
                    onClose={() => {
                        setLocalError(null);
                        clearError();
                    }}
                />
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                        <ReceiptIcon sx={{ mr: 1 }} />
                        Order Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Customer Email
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        {userEmail}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Order Details
                    </Typography>

                    {cart.products && cart.products.length > 0 ? (
                        <Stack spacing={1} sx={{ mb: 2 }}>
                            {cart.products.map((item, index) => (
                                <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">
                                                {item.productName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ${item.price?.toFixed(2) || '0.00'} × {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right">
                                            <Chip
                                                label={`$${(item.price * item.quantity || 0).toFixed(2)}`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}

                            <Divider />

                            <Box display="flex" justifyContent="space-between" alignItems="center" pt={1}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                                    Total Amount:
                                </Typography>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    color="primary"
                                    sx={{ fontWeight: 700 }}
                                    data-testid="total-amount"
                                >
                                    ${cart.totalAmount?.toFixed(2) || '0.00'}
                                </Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No items in cart
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Box display="flex" gap={2} justifyContent="center">
                <Button
                    variant="outlined"
                    size="large"
                    href="/cart"
                    startIcon={<CartIcon />}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                    }}
                >
                    Back to Cart
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleConfirmOrder}
                    disabled={loading || !cart.products || cart.products.length === 0}
                    startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                    }}
                >
                    {loading ? 'Confirming Order...' : 'Confirm Order'}
                </Button>
            </Box>
        </Box>
    );
};

export default Checkout;
