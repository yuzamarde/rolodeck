"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/navigation'

interface CartItem {
    id: number
    slug: string
    name: string
    variant: string
    price: number
    quantity: number
    image: string
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            slug: "the-barista-express",
            name: "the Barista Express",
            variant: "Truffle Black",
            price: 798,
            quantity: 1,
            image: "https://res.cloudinary.com/df4yjb9f4/image/upload/v1754916897/theBaristaExpress-1_nlq09u.png"
        },
        {
            id: 2,
            slug: "the-barista-express",
            name: "the Barista Express",
            variant: "Stainless Steel",
            price: 798,
            quantity: 1,
            image: "https://res.cloudinary.com/df4yjb9f4/image/upload/v1754916897/theBaristaExpress-2_wk9qwx.png"
        },
        {
            id: 3,
            slug: "the-bambino",
            name: "the Bambino",
            variant: "Stainless Steel",
            price: 498,
            quantity: 2,
            image: "https://res.cloudinary.com/df4yjb9f4/image/upload/v1754916895/theBambino-1_rumlke.png"
        }
    ])

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        )
    }

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    const router = useRouter()

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-medium text-gray-900">Your Cart</h1>
                    <span className="text-lg text-gray-500">{totalItems} items</span>
                </div>

                {/* Cart Items */}
                <div className="space-y-0">
                    {cartItems.map((item, index) => (
                        <div key={item.id}>
                            {/* Product Item */}
                            <div className="flex items-center py-6">
                                {/* Product Image */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden mr-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {item.variant}
                                    </p>
                                </div>

                                {/* Price and Quantity */}
                                <div className="text-right">
                                    <div className="text-lg font-medium text-gray-900 mb-1">
                                        ${item.price}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 ml-6">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>

                                    <span className="text-gray-900 font-medium min-w-[2rem] text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Divider Line */}
                            {index < cartItems.length - 1 && (
                                <div className="border-t border-gray-200"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty Cart State */}
                {cartItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Add some products to get started</p>
                        <Button
                            onClick={() => window.history.back()}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                )}
            </div>

            {/* Sticky Footer */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-4 z-50">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <Button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 rounded-xs text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Button>

                        <div className="text-xl font-medium text-gray-900">
                            Total ${totalPrice}
                        </div>

                        <Button
                            onClick={() => router.push('/details')}
                            className="bg-green-600 hover:bg-green-700 rounded-xs text-white px-8 py-3 flex items-center gap-2"
                        >
                            Check Out
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
} 