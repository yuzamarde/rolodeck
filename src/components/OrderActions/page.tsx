"use client"

import { Button } from '@/components/ui/button'

interface OrderActionsProps {
    onContinueShopping: () => void
}

export default function OrderActions({ onContinueShopping }: OrderActionsProps) {
    return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
                onClick={onContinueShopping}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg"
            >
                Continue Shopping
            </Button>
            <Button
                onClick={() => window.print()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg"
            >
                Print Receipt
            </Button>
        </div>
    )
} 