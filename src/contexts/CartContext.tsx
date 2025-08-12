"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Product {
    id: number
    slug: string
    name: string
    price: number
    images: string[]
}

interface CartItem {
    id: number
    slug: string
    name: string
    price: number
    quantity: number
    image: string
    color?: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity?: number, color?: string) => void
    removeFromCart: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error)
                localStorage.removeItem('cart')
            }
        }
    }, [])

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addToCart = (product: Product, quantity: number = 1, color?: string) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item =>
                item.id === product.id && item.color === color
            )

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.id === product.id && item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Add new item
                const newItem: CartItem = {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images[0],
                    color
                }
                return [...prevItems, newItem]
            }
        })
    }

    const removeFromCart = (productId: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
} 