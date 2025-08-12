"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ProductStickyFooterProps {
    price: number
    quantity: number
    onQuantityChange: (quantity: number) => void
    onAddToCart: () => void
}

export default function ProductStickyFooter({
    price,
    quantity,
    onQuantityChange,
    onAddToCart
}: ProductStickyFooterProps) {
    const router = useRouter()

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Button
                    onClick={() => router.push('/product')}
                    className="flex items-center gap-2 rounded-xs text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>

                <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <select
                            value={quantity}
                            onChange={(e) => onQuantityChange(parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-xl font-medium text-gray-900">
                        Total ${price * quantity}
                    </div>
                </div>

                <Button
                    onClick={onAddToCart}
                    className="bg-green-600 hover:bg-green-700 rounded-xs text-white px-8 py-3 flex items-center gap-2"
                >
                    Add to Cart
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Button>
            </div>
        </div>
    )
} 