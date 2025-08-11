"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'

interface PaymentData {
    email: string
    name: string
}

export default function PaymentPage() {
    const router = useRouter()
    const [paymentData, setPaymentData] = useState<PaymentData>({
        email: '',
        name: ''
    })
    const [cartItems, setCartItems] = useState<any[]>([])
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        // Check if there are items in cart (simulating cart state)
        const mockCartItems = [
            { id: 1, name: "the Barista Express", variant: "Truffle Black", price: 798, quantity: 1 },
            { id: 2, name: "the Barista Express", variant: "Stainless Steel", price: 798, quantity: 1 },
            { id: 3, name: "the Bambino", variant: "Stainless Steel", price: 498, quantity: 2 }
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

    const handleInputChange = (field: keyof PaymentData, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePayment = () => {
        if (!paymentData.email.trim() || !paymentData.name.trim()) {
            alert('Please fill in all required fields')
            return
        }

        // In a real app, you would process the payment
        console.log('Payment processed:', paymentData)
        alert('Payment successful! Redirecting to confirmation...')
        // Navigate to confirmation page or back to home
        router.push('/')
    }

    const handleBack = () => {
        router.push('/details')
    }

    // If no cart items, show loading or redirect
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl text-gray-600">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Panel - Payment Summary */}
                    <div className="bg-gray-50 rounded-xl p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Rolo Coffee</h2>
                        </div>

                        {/* Total Amount */}
                        <div className="mb-8">
                            <h3 className="text-lg text-gray-700 mb-2">Pay Rolo Coffee</h3>
                            <div className="text-4xl font-bold text-gray-900">SGD ${totalPrice}</div>
                        </div>

                        {/* Itemized List */}
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-gray-900">{item.name}</div>
                                        <div className="text-sm text-gray-500">{item.variant}</div>
                                    </div>
                                    <div className="text-gray-900">SGD ${item.price}</div>
                                </div>
                            ))}

                            {/* Subtotal */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="text-gray-900">SGD ${totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {/* Promotion Code */}
                        <div className="mb-6">
                            <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3">
                                Add promotion code
                            </Button>
                        </div>

                        {/* Final Total */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900">Total due</span>
                                <span className="text-2xl font-bold text-gray-900">SGD ${totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Payment Details */}
                    <div className="space-y-8">
                        {/* Section Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Pay with PayNow</h1>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={paymentData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={paymentData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder=""
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h3>

                            <div className="bg-gray-50 rounded-lg p-6">
                                {/* PayNow Logo */}
                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-purple-600">PAYNOW</span>
                                </div>

                                {/* PayNow Description */}
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    PayNow is supported by bank apps and payment apps such as DBS, POSB, OCBC, UOB and GrabPay
                                </p>

                                {/* QR Code Info */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        You will be shown a QR code to scan using your preferred banking or payment app
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <div>
                            <Button
                                onClick={handlePayment}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg"
                            >
                                Pay
                            </Button>
                        </div>

                        {/* Footer Links */}
                        <div className="text-center space-y-2">
                            <div className="text-sm text-gray-500">
                                Powered by <span className="text-blue-600">stripe</span>
                            </div>
                            <div className="flex justify-center gap-4 text-sm">
                                <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
                                <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="fixed bottom-8 left-8">
                <Button
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>
            </div>
        </div>
    )
} 