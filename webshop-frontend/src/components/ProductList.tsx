import React, { useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { useWebshop } from '../context/WebshopContext';
import { getAllProducts } from '../services/api';
import type { Product } from '../context/WebshopContext';

const ProductList: React.FC = () => {
    const { products, setProducts, addProductToCart } = useWebshop();

    useEffect(() => {
        const fetchProducts = async () => {
            const productsData = await getAllProducts();
            setProducts(productsData as Product[]);
        };
        fetchProducts();
    }, [setProducts]);

    return (
        <Box>
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}
            >
                Available Products
            </Typography>

            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    gutterBottom
                                    sx={{ fontWeight: 600 }}
                                >
                                    {product.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    {product.description}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        icon={<CategoryIcon />}
                                        label={product.category}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <InventoryIcon
                                            sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {product.stockQuantity > 0
                                                ? `${product.stockQuantity} in stock`
                                                : 'Out of stock'
                                            }
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    variant="h6"
                                    color="primary.main"
                                    sx={{ fontWeight: 700 }}
                                >
                                    ${product.price.toFixed(2)}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => addProductToCart(product, 1)}
                                    disabled={product.stockQuantity <= 0}
                                    id={`add-to-cart-${product.id}`}
                                    sx={{
                                        py: 1,
                                        fontWeight: 500,
                                        ...(product.stockQuantity <= 0 && {
                                            backgroundColor: 'grey.300',
                                            color: 'grey.600'
                                        })
                                    }}
                                >
                                    {product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductList;
