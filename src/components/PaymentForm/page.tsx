"use client"

import PaymentFormField from '@/components/PaymentFormField/page'
import StripePayment from '@/components/StripePayment/page'

interface PaymentData {
    email: string
    name: string
}

interface PaymentFormProps {
    paymentData: PaymentData
    onPaymentDataChange: (field: keyof PaymentData, value: string) => void
    amount: number
    orderId: string
    onSuccess: () => void
}

export default function PaymentForm({
    paymentData,
    onPaymentDataChange,
    amount,
    orderId,
    onSuccess
}: PaymentFormProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

            {/* Customer Details */}
            <div className="space-y-4 mb-6">
                <PaymentFormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={paymentData.email}
                    placeholder="Enter your email"
                    onChange={(value) => onPaymentDataChange('email', value)}
                    required
                />
                <PaymentFormField
                    id="name"
                    label="Full Name"
                    type="text"
                    value={paymentData.name}
                    placeholder="Enter your full name"
                    onChange={(value) => onPaymentDataChange('name', value)}
                    required
                />
            </div>

            {/* Stripe Payment Component */}
            <StripePayment
                amount={amount}
                orderId={orderId}
                customerEmail={paymentData.email}
                customerName={paymentData.name}
                onSuccess={onSuccess}
            />
        </div>
    )
} 