"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import CheckoutHeader from '@/components/CheckoutHeader/page'
import CheckoutForm from '@/components/CheckoutForm/page'
import CheckoutStickyFooter from '@/components/CheckoutStickyFooter/page'

interface CustomerInfo {
    name: string
    email: string
    streetAddress: string
    unitNumber: string
    postalCode: string
}

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice } = useCart()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showValidation, setShowValidation] = useState(false)
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        streetAddress: '',
        unitNumber: '',
        postalCode: ''
    })

    // Redirect if cart is empty
    if (items.length === 0) {
        router.push('/cart')
        return null
    }

    const handleInputChange = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }))
        // Hide validation errors when user starts typing
        if (showValidation) {
            setShowValidation(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setShowValidation(true)

        // Validate required fields
        const requiredFields: (keyof CustomerInfo)[] = ['name', 'email', 'streetAddress', 'postalCode']
        const missingFields = requiredFields.filter(field => !customerInfo[field].trim())

        if (missingFields.length > 0) {
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(customerInfo.email)) {
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare order data for payment page
            const orderData = {
                orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
                orderDate: new Date().toISOString(),
                customerName: customerInfo.name,
                email: customerInfo.email,
                streetAddress: customerInfo.streetAddress,
                houseNumber: customerInfo.unitNumber || 'N/A',
                postalCode: customerInfo.postalCode,
                totalAmount: getTotalPrice(),
                products: items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color || 'N/A'
                }))
            }

            // Store order data in localStorage for payment page
            localStorage.setItem('pendingOrder', JSON.stringify(orderData))

            // Redirect to payment page
            router.push('/payment')
        } catch (error) {
            console.error('Failed to prepare order:', error)
            alert('Failed to prepare order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push('/cart')
    }

    // Check if all required fields are filled
    const isFormValid = () => {
        const requiredFields: (keyof CustomerInfo)[] = ['name', 'email', 'streetAddress', 'postalCode']
        return requiredFields.every(field => customerInfo[field].trim() !== '')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <CheckoutHeader />

                {/* Form */}
                <CheckoutForm
                    customerInfo={customerInfo}
                    showValidation={showValidation}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />
            </div>

            {/* Sticky Footer */}
            <CheckoutStickyFooter
                totalAmount={getTotalPrice()}
                isFormValid={isFormValid()}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onSubmit={handleSubmit}
            />
        </div>
    )
} 