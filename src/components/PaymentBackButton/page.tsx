"use client"

import { Button } from '@/components/ui/button'

interface PaymentBackButtonProps {
    onBack: () => void
}

export default function PaymentBackButton({ onBack }: PaymentBackButtonProps) {
    return (
        <div className="mt-8 text-center">
            <Button
                onClick={onBack}
                variant="outline"
                className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
                ← Back to Checkout
            </Button>
        </div>
    )
} 