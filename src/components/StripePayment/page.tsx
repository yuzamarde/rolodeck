"use client"

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'

interface StripePaymentProps {
    amount: number
    orderId: string
    customerEmail: string
    customerName: string
    onSuccess: () => void
}

interface StripeCardChangeEvent {
    complete: boolean
    error?: {
        message: string
    }
}

export default function StripePayment({
    amount,
    orderId,
    customerEmail,
    customerName,
    onSuccess
}: StripePaymentProps) {
    const stripe = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)
    const [cardComplete, setCardComplete] = useState(false)
    const [cardError, setCardError] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'submitting' | 'success'>('idle')

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    }

    const handlePayment = async () => {
        if (!stripe || !elements) {
            setErrorMessage('Stripe not initialized')
            return
        }

        setLoading(true)
        setErrorMessage(null)
        setPaymentStatus('pending')

        try {
            // Create payment intent
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    orderId,
                    customerEmail,
                    customerName,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create payment intent')
            }

            const { clientSecret } = await response.json()

            // Confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: customerName,
                        email: customerEmail,
                    },
                },
            })

            if (result.error) {
                throw new Error(result.error.message || 'Payment failed')
            }

            if (result.paymentIntent?.status === 'succeeded') {
                setPaymentStatus('submitting')

                // Call onSuccess callback
                try {
                    await onSuccess()
                    setPaymentStatus('success')
                } catch (error) {
                    console.error('Error in onSuccess callback:', error)
                    setErrorMessage('Payment succeeded but order update failed')
                }
            } else {
                throw new Error('Payment was not completed')
            }
        } catch (error) {
            console.error('Payment error:', error)
            setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
            setPaymentStatus('idle')
        } finally {
            setLoading(false)
        }
    }

    const handleCardChange = (event: StripeCardChangeEvent) => {
        setCardComplete(event.complete)
        setCardError(event.error ? event.error.message : null)
    }

    const checkOrderStatus = () => {
        window.location.href = `/checkout/${orderId}`
    }

    // Check if form is valid (card complete and no errors)
    const isFormValid = cardComplete && !cardError

    return (
        <div className="space-y-4">
            {/* Card Input */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                </label>
                <CardElement
                    options={cardElementOptions}
                    onChange={handleCardChange}
                />
                <p className="text-xs text-gray-500 mt-2">
                    Test with: 4242 4242 4242 4242
                </p>
                {cardError && (
                    <p className="text-xs text-red-600 mt-2">
                        {cardError}
                    </p>
                )}
            </div>

            {/* Payment Button */}
            <Button
                onClick={handlePayment}
                disabled={loading || !stripe || !isFormValid}
                className={`w-full py-4 text-lg font-semibold rounded-lg ${loading || !stripe || !isFormValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
            >
                {loading ? 'Processing Payment...' : `Pay SGD $${amount.toFixed(2)}`}
            </Button>

            {/* Form Validation Message */}
            {!isFormValid && !loading && (
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                        {!cardComplete ? 'Please complete your card details' : 'Please fix card errors'}
                    </p>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-red-800 font-semibold">Payment Error</span>
                    </div>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
            )}

            {/* Payment Status */}
            {paymentStatus === 'pending' && (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                        <span className="text-yellow-800">Processing payment...</span>
                    </div>
                </div>
            )}

            {paymentStatus === 'submitting' && (
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-800 font-semibold">Payment Successful!</span>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                        Updating order status and redirecting...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            )}

            {paymentStatus === 'success' && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-semibold">Payment Complete!</span>
                    </div>
                    <p className="text-green-700 text-sm mb-3">
                        Your order has been successfully processed.
                    </p>
                    <Button
                        onClick={checkOrderStatus}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Check Order Status
                    </Button>
                </div>
            )}

            {/* Test Mode Notice */}
            <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500">
                    💳 Test Mode: Use test card numbers for development
                </p>
            </div>
        </div>
    )
} 