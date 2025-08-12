"use client"

import { Button } from '@/components/ui/button'

interface CartItemProps {
    item: {
        id: number
        name: string
        price: number
        quantity: number
        color?: string
        image: string
    }
    onUpdateQuantity: (id: number, quantity: number) => void
    onRemove: (id: number) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex items-center p-6 border-b last:border-b-0">
            {/* Product Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden mr-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                )}
                <p className="text-lg font-medium text-gray-900">${item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 mr-4">
                <Button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 p-0 text-sm"
                    variant="outline"
                >
                    -
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 p-0 text-sm"
                    variant="outline"
                >
                    +
                </Button>
            </div>

            {/* Total Price */}
            <div className="text-right mr-4">
                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            {/* Remove Button */}
            <Button
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-700 p-2"
                variant="ghost"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
    )
} 