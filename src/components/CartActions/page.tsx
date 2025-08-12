"use client"

import { Button } from '@/components/ui/button'

interface CartActionsProps {
    onClearCart: () => void
    onContinueShopping: () => void
}

export default function CartActions({ onClearCart, onContinueShopping }: CartActionsProps) {
    return (
        <div className="mt-6 flex justify-between items-center">
            <Button
                onClick={onClearCart}
                className="text-red-600 hover:text-red-700"
                variant="ghost"
            >
                Clear Cart
            </Button>

            <Button
                onClick={onContinueShopping}
                className="text-green-600 hover:text-green-700"
                variant="ghost"
            >
                Continue Shopping
            </Button>
        </div>
    )
} 