"use client"

import CheckoutFormField from '@/components/CheckoutFormField/page'

interface CustomerInfo {
    name: string
    email: string
    streetAddress: string
    unitNumber: string
    postalCode: string
}

interface CheckoutFormProps {
    customerInfo: CustomerInfo
    showValidation: boolean
    onInputChange: (field: keyof CustomerInfo, value: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function CheckoutForm({
    customerInfo,
    showValidation,
    onInputChange,
    onSubmit
}: CheckoutFormProps) {
    // Helper function to show field error
    const showFieldError = (field: keyof CustomerInfo) => {
        return showValidation && customerInfo[field].trim() === ''
    }

    // Helper function to show email format error
    const showEmailError = () => {
        return showValidation && customerInfo.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CheckoutFormField
                    id="name"
                    label="Your Name"
                    type="text"
                    value={customerInfo.name}
                    placeholder="James Hoffman"
                    required
                    error={showFieldError('name') ? 'Name is required' : undefined}
                    onChange={(value) => onInputChange('name', value)}
                />

                <CheckoutFormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={customerInfo.email}
                    placeholder="james@gmail.com"
                    required
                    error={
                        showFieldError('email')
                            ? 'Email is required'
                            : showEmailError()
                                ? 'Please enter a valid email address'
                                : undefined
                    }
                    onChange={(value) => onInputChange('email', value)}
                />
            </div>

            {/* Street Address - Full Width */}
            <CheckoutFormField
                id="streetAddress"
                label="Street Address"
                type="text"
                value={customerInfo.streetAddress}
                placeholder="1 Sesame Street, Big Bird Building"
                required
                error={showFieldError('streetAddress') ? 'Street address is required' : undefined}
                onChange={(value) => onInputChange('streetAddress', value)}
            />

            {/* Unit Number and Postal Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CheckoutFormField
                    id="unitNumber"
                    label="Unit / House Number"
                    type="text"
                    value={customerInfo.unitNumber}
                    placeholder="#12-34"
                    optional
                    onChange={(value) => onInputChange('unitNumber', value)}
                />

                <CheckoutFormField
                    id="postalCode"
                    label="Postal Code"
                    type="text"
                    value={customerInfo.postalCode}
                    placeholder="123456"
                    required
                    error={showFieldError('postalCode') ? 'Postal code is required' : undefined}
                    onChange={(value) => onInputChange('postalCode', value)}
                />
            </div>
        </form>
    )
} 