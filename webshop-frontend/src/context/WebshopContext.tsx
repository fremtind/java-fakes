import React, { createContext, useState, useContext } from 'react';
import { addProductToCart as apiAddProductToCart, updateProductQuantity as apiUpdateProductQuantity } from '../services/api';

type ReactNode = React.ReactNode;

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    stockQuantity: number;
}

interface CartProduct {
    productId: number;
    productName: string;  // Changed from 'name' to 'productName' to match backend
    price: number;
    quantity: number;
}

interface ShoppingCart {
    id: number;
    userEmail: string;
    products: CartProduct[];
    totalAmount: number;
}

interface WebshopContextType {
    userEmail: string | null;
    setUserEmail: (email: string | null) => void;
    cart: ShoppingCart | null;
    setCart: (cart: ShoppingCart | null) => void;
    products: Product[];
    setProducts: (products: Product[]) => void;
    addProductToCart: (product: Product, quantity: number) => void;
    removeProductFromCart: (productId: number) => void;
    updateProductQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    error: string | null;
    setError: (error: string | null) => void;
    clearError: () => void;
}

const WebshopContext = createContext<WebshopContextType | undefined>(undefined);

export const WebshopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [cart, setCart] = useState<ShoppingCart | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setErrorState] = useState<string | null>(null);

    const addProductToCart = async (product: Product, quantity: number) => {
        if (!cart) return;

        try {
            const existingProduct = cart.products.find(p => p.productId === product.id);
            if (existingProduct) {
                // Update quantity via API
                const updatedCart = await apiUpdateProductQuantity(cart.id, product.id, existingProduct.quantity + quantity);
                setCart(updatedCart);
            } else {
                // Add new product via API
                const updatedCart = await apiAddProductToCart(cart.id, product.id, quantity);
                setCart(updatedCart);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            setError('Failed to add product to cart');
        }
    };

    const removeProductFromCart = (productId: number) => {
        if (!cart) return;
        const productToRemove = cart.products.find(p => p.productId === productId);
        if (!productToRemove) return;

        const newProducts = cart.products.filter(p => p.productId !== productId);
        const newTotal = cart.totalAmount - (productToRemove.price * productToRemove.quantity);

        setCart({
            ...cart,
            products: newProducts,
            totalAmount: newTotal
        });
    };

    const updateProductQuantity = (productId: number, quantity: number) => {
        if (!cart) return;
        const updatedProducts = cart.products.map(p =>
            p.productId === productId ? { ...p, quantity } : p
        );
        const newTotal = updatedProducts.reduce((total, p) => total + (p.price * p.quantity), 0);

        setCart({
            ...cart,
            products: updatedProducts,
            totalAmount: newTotal
        });
    };

    const clearCart = () => {
        setCart(null);
    };

    const setError = (error: string | null) => {
        setErrorState(error);
    };

    const clearError = () => {
        setErrorState(null);
    };

    return (
        <WebshopContext.Provider value={{
            userEmail,
            setUserEmail,
            cart,
            setCart,
            products,
            setProducts,
            addProductToCart,
            removeProductFromCart,
            updateProductQuantity,
            clearCart,
            error,
            setError,
            clearError
        }}>
            {children}
        </WebshopContext.Provider>
    );
};

export const useWebshop = (): WebshopContextType => {
    const context = useContext(WebshopContext);
    if (!context) {
        throw new Error('useWebshop must be used within a WebshopProvider');
    }
    return context;
};
