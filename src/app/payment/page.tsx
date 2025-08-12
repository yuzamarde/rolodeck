"use client"

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { Stripe } from '@stripe/stripe-js'
import { getStripe } from '@/lib/stripe'
import { useCart } from '@/contexts/CartContext'
import PaymentHeader from '@/components/PaymentHeader/page'
import PaymentForm from '@/components/PaymentForm/page'
import OrderSummary from '@/components/OrderSummary/page'
import PaymentBackButton from '@/components/PaymentBackButton/page'
import PaymentLoadingState from '@/components/PaymentLoadingState/page'
import PaymentNoOrderState from '@/components/PaymentNoOrderState/page'

interface PaymentData {
    email: string
    name: string
}

interface OrderData {
    orderId: string
    orderDate: string
    customerName: string
    email: string
    streetAddress: string
    houseNumber: string
    postalCode: string
    totalAmount: number
    products: Array<{
        name: string
        price: number
        quantity: number
        color: string
    }>
}

export default function PaymentPage() {
    const { clearCart } = useCart()
    const [paymentData, setPaymentData] = useState<PaymentData>({ email: '', name: '' })
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)
    const [stripePromise, setStripePromise] = useState<Stripe | null>(null)

    useEffect(() => {
        // Load Stripe
        const loadStripe = async () => {
            const stripe = await getStripe()
            setStripePromise(stripe)
        }
        loadStripe()

        // Load order data
        const storedOrder = localStorage.getItem('pendingOrder')
        if (!storedOrder) {
            window.location.href = '/cart'
            return
        }

        try {
            const parsedOrder = JSON.parse(storedOrder)
            setOrderData(parsedOrder)
            setPaymentData(prev => ({ ...prev, email: parsedOrder.email }))
            setLoading(false)
        } catch (error) {
            console.error('Failed to parse order data:', error)
            window.location.href = '/cart'
        }
    }, [])

    const handlePaymentSuccess = async () => {
        if (!orderData) {
            console.error('No order data available for Google Sheets submission')
            throw new Error('No order data available')
        }

        try {
            // Show loading state for Google Sheets submission
            console.log('Payment successful! Starting Google Sheets submission...')
            console.log('Order data available:', orderData)

            // Submit order to Google Sheets
            const rows = orderData.products.map(item => [
                orderData.orderId,
                orderData.orderDate,
                orderData.customerName,
                orderData.email,
                orderData.streetAddress,
                orderData.houseNumber,
                orderData.postalCode,
                item.name,
                item.price,
                item.quantity,
                item.color,
                orderData.totalAmount,
                'Paid' // Update status to Paid
            ])

            console.log('Prepared rows for Google Sheets:', rows)
            console.log('Submitting order data to Google Sheets:', {
                orderId: orderData.orderId,
                totalAmount: orderData.totalAmount,
                productsCount: orderData.products.length,
                rowsToSubmit: rows.length
            })

            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderData, items: rows })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to submit order: ${response.status} - ${errorText}`)
            }

            const result = await response.json()
            console.log('Google Sheets submission successful:', result)

            // Clear cart and redirect to order confirmation
            clearCart()
            localStorage.removeItem('pendingOrder')
            window.location.href = `/checkout/${orderData.orderId}`

        } catch (error) {
            console.error('Failed to submit order to Google Sheets:', error)
            throw error
        }
    }

    const handleBack = () => {
        window.location.href = '/checkout'
    }

    const handlePaymentDataChange = (field: keyof PaymentData, value: string) => {
        setPaymentData(prev => ({ ...prev, [field]: value }))
    }

    if (loading) {
        return <PaymentLoadingState />
    }

    if (!orderData) {
        return <PaymentNoOrderState />
    }

    if (!stripePromise) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl text-gray-600">Loading payment system...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PaymentHeader />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            paymentData={paymentData}
                            onPaymentDataChange={handlePaymentDataChange}
                            amount={orderData.totalAmount}
                            orderId={orderData.orderId}
                            onSuccess={handlePaymentSuccess}
                        />
                    </Elements>
                    <OrderSummary
                        products={orderData.products}
                        totalAmount={orderData.totalAmount}
                        customerName={orderData.customerName}
                        streetAddress={orderData.streetAddress}
                        houseNumber={orderData.houseNumber}
                        postalCode={orderData.postalCode}
                    />
                </div>
                <PaymentBackButton onBack={handleBack} />
            </div>
        </div>
    )
} 