"use client"

import { Button } from '@/components/ui/button'

interface CartStickyFooterProps {
    totalPrice: number
    isCheckingOut: boolean
    onContinueShopping: () => void
    onCheckout: () => void
}

export default function CartStickyFooter({
    totalPrice,
    isCheckingOut,
    onContinueShopping,
    onCheckout
}: CartStickyFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Button
                    onClick={onContinueShopping}
                    className="flex items-center gap-2 rounded-xs text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                </Button>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
                    </div>
                </div>

                <Button
                    onClick={onCheckout}
                    className="bg-green-600 hover:bg-green-700 rounded-xs text-white px-8 py-3 flex items-center gap-2"
                    disabled={isCheckingOut}
                >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>
        </div>
    )
} 