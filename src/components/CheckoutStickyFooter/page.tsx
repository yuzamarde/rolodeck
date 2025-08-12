"use client"

import { Button } from '@/components/ui/button'

interface CheckoutStickyFooterProps {
    totalAmount: number
    isFormValid: boolean
    isSubmitting: boolean
    onBack: () => void
    onSubmit: (e: React.FormEvent) => void
}

export default function CheckoutStickyFooter({
    totalAmount,
    isFormValid,
    isSubmitting,
    onBack,
    onSubmit
}: CheckoutStickyFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-4 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Button
                    onClick={onBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xs flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Cart
                </Button>

                <div className="text-center">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                </div>

                <Button
                    onClick={(e) => onSubmit(e as React.FormEvent)}
                    disabled={!isFormValid || isSubmitting}
                    className={`px-8 py-3 rounded-xs flex items-center gap-2 transition-all ${isFormValid && !isSubmitting
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>
        </div>
    )
} 