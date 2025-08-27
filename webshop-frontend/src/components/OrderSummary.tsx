import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Chip
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { getOrderSummary } from '../services/api';

interface OrderLine {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        description: string;
        category: string;
        stockQuantity: number;
    };
    price: number;
    quantity: number;
    purchaseOrderId: number;
}

interface OrderSummaryData {
    id: number;
    customer: {
        id: number;
        name: string;
        email: string;
    };
    orderDate: string;
    status: string;
    totalAmount: number;
    orderLines: OrderLine[];
}

const OrderSummary: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<OrderSummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderSummary = async () => {
            if (!orderId) {
                setError('Order ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getOrderSummary(orderId) as OrderSummaryData;
                setOrderData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching order summary:', err);
                setError('Failed to load order summary. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderSummary();
    }, [orderId]);

    const handleBackToShop = () => {
        navigate('/cart');
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box maxWidth="md" mx="auto">
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBackToShop}
                    >
                        Back to Shop
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleBackToLogin}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!orderData) {
        return (
            <Box maxWidth="md" mx="auto">
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Order not found
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBackToShop}
                >
                    Back to Shop
                </Button>
            </Box>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Box maxWidth="md" mx="auto">
            {/* Success Header */}
            <Card sx={{ mb: 3, backgroundColor: 'success.main', color: 'success.contrastText' }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <CheckCircle fontSize="large" />
                        <Box>
                            <Typography variant="h5" component="h1" fontWeight="bold">
                                Order Confirmed!
                            </Typography>
                            <Typography variant="body1">
                                Thank you for your purchase. Your order has been successfully placed.
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Order Details */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Order Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Order ID
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    #{orderData.id}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Order Date
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(orderData.orderDate)}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Customer Email
                                </Typography>
                                <Typography variant="body1">
                                    {orderData.customer.email}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Status
                                </Typography>
                                <Chip 
                                    label={orderData.status} 
                                    color="success" 
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Order Items
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderData.orderLines.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            {item.product.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(item.product.price)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight="bold">
                                                {formatCurrency(item.price * item.quantity)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} align="right">
                                        <Typography variant="h6" fontWeight="bold">
                                            Total Amount:
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6" fontWeight="bold" color="primary">
                                            {formatCurrency(orderData.totalAmount)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="center">
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBackToShop}
                >
                    Continue Shopping
                </Button>
                <Button
                    variant="contained"
                    onClick={handleBackToLogin}
                >
                    Back to Login
                </Button>
            </Box>
        </Box>
    );
};

export default OrderSummary;