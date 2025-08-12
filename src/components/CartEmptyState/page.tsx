"use client"

import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar/page'

interface CartEmptyStateProps {
    onContinueShopping: () => void
}

export default function CartEmptyState({ onContinueShopping }: CartEmptyStateProps) {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
                    <Button
                        onClick={onContinueShopping}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    )
} 