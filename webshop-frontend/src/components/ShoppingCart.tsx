import React from 'react';
import {
    Typography,
    List,
    ListItem,
    IconButton,
    Button,
    Box,
    Divider,
    ButtonGroup,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import {
    Remove as RemoveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ShoppingCart as CartIcon,
    Payment as PaymentIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useWebshop } from '../context/WebshopContext';
import { useNavigate } from 'react-router-dom';

const ShoppingCart: React.FC = () => {
    const { cart, removeProductFromCart, updateProductQuantity, clearCart } = useWebshop();
    const navigate = useNavigate();

    if (!cart || cart.products.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <CartIcon
                    sx={{
                        fontSize: 64,
                        color: 'grey.400',
                        mb: 2
                    }}
                />
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                    Your Shopping Cart
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your cart is empty. Start shopping to add items!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}
            >
                Shopping Cart
            </Typography>

            <List sx={{ mb: 2 }}>
                {cart.products.map((product, index) => (
                    <React.Fragment key={product.productId}>
                        <ListItem
                            sx={{
                                px: 0,
                                py: 2,
                                flexDirection: 'column',
                                alignItems: 'stretch'
                            }}
                        >
                            <Box sx={{ width: '100%', mb: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary.main"
                                    sx={{ fontWeight: 700 }}
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <ButtonGroup size="small" variant="outlined">
                                    <IconButton
                                        onClick={() => updateProductQuantity(product.productId, product.quantity - 1)}
                                        disabled={product.quantity <= 1}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            minWidth: 40,
                                            justifyContent: 'center',
                                            fontWeight: 600
                                        }}
                                    >
                                        {product.quantity}
                                    </Box>
                                    <IconButton
                                        onClick={() => updateProductQuantity(product.productId, product.quantity + 1)}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </ButtonGroup>

                                <IconButton
                                    onClick={() => removeProductFromCart(product.productId)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                        {index < cart.products.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>

            <Card
                variant="outlined"
                sx={{
                    mb: 3,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                }}
            >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Total: ${cart.totalAmount.toFixed(2)}
                    </Typography>
                </CardContent>
            </Card>

            <Stack spacing={2}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<PaymentIcon />}
                    onClick={() => navigate('/confirmation')}
                    sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600
                    }}
                >
                    Proceed to Checkout
                </Button>

                <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={clearCart}
                    sx={{ py: 1.5 }}
                >
                    Clear Cart
                </Button>
            </Stack>
        </Box>
    );
};

export default ShoppingCart;
