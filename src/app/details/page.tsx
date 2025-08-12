"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface FormData {
    name: string
    email: string
    streetAddress: string
    unitNumber: string
    postalCode: string
}

interface CartItem {
    id: number
    price: number
    quantity: number
}

export default function DetailsPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        streetAddress: '',
        unitNumber: '',
        postalCode: ''
    })
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [showValidation, setShowValidation] = useState(false)

    useEffect(() => {
        // Check if there are items in cart (simulating cart state)
        const mockCartItems = [
            { id: 1, price: 798, quantity: 1 },
            { id: 2, price: 798, quantity: 1 },
            { id: 3, price: 498, quantity: 2 }
        ]

        if (mockCartItems.length === 0) {
            // Redirect to cart if no items
            router.push('/cart')
            return
        }

        setCartItems(mockCartItems)
        const total = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        setTotalPrice(total)
    }, [router])

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Hide validation errors when user starts typing
        if (showValidation) {
            setShowValidation(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Show validation errors
        setShowValidation(true)

        // Validate required fields
        const requiredFields: (keyof FormData)[] = ['name', 'email', 'streetAddress', 'postalCode']
        const missingFields = requiredFields.filter(field => !formData[field].trim())

        if (missingFields.length > 0) {
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            return
        }

        // In a real app, you would validate and submit the form
        console.log('Form submitted:', formData)
        // Navigate to payment page or next step
        router.push('/payment')
    }

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields: (keyof FormData)[] = ['name', 'email', 'streetAddress', 'postalCode']
        return requiredFields.every(field => formData[field].trim() !== '')
    }

    // Helper function to show field error
    const showFieldError = (field: keyof FormData) => {
        return showValidation && formData[field].trim() === ''
    }

    // Helper function to show email format error
    const showEmailError = () => {
        return showValidation && formData.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    }

    const handleBack = () => {
        router.push('/cart')
    }

    // If no cart items, show loading or redirect
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl text-gray-600">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Your Details</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="James Hoffman"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${showFieldError('name') ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {showFieldError('name') && (
                                <p className="text-red-500 text-sm mt-1">Name is required</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="james@gmail.com"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${showFieldError('email') ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {showFieldError('email') && (
                                <p className="text-red-500 text-sm mt-1">Email is required</p>
                            )}
                            {showEmailError() && (
                                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                            )}
                        </div>
                    </div>

                    {/* Street Address - Full Width */}
                    <div>
                        <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="streetAddress"
                            value={formData.streetAddress}
                            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            placeholder="1 Sesame Street, Big Bird Building"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${showFieldError('streetAddress') ? 'border-red-300' : 'border-gray-300'
                                }`}
                            required
                        />
                        {showFieldError('streetAddress') && (
                            <p className="text-red-500 text-sm mt-1">Street address is required</p>
                        )}
                    </div>

                    {/* Unit Number and Postal Code Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Unit / House Number <span className="text-gray-400 font-normal">Optional</span>
                            </label>
                            <input
                                type="text"
                                id="unitNumber"
                                value={formData.unitNumber}
                                onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                                placeholder="#12-34"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                placeholder="123456"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${showFieldError('postalCode') ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {showFieldError('postalCode') && (
                                <p className="text-red-500 text-sm mt-1">Postal code is required</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-4 z-50">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Button
                        onClick={handleBack}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xs flex items-center gap-2"
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
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className={`px-8 py-3 rounded-xs flex items-center gap-2 transition-all ${isFormValid()
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Make Payment
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
} 