import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import ProductList from './ProductList';
import ShoppingCart from './ShoppingCart';

const ShopPage: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
            >
                Shop Products
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            minHeight: '500px'
                        }}
                    >
                        <ProductList />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            position: 'sticky',
                            top: 24
                        }}
                    >
                        <ShoppingCart />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ShopPage;
