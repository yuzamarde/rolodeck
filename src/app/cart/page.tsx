"use client"

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import CartEmptyState from '@/components/CartEmptyState/page'
import CartItem from '@/components/CartItem/page'
import CartActions from '@/components/CartActions/page'
import CartStickyFooter from '@/components/CartStickyFooter/page'

export default function CartPage() {
    const router = useRouter()
    const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()

    const handleCheckout = () => {
        if (items.length === 0) return
        router.push('/checkout')
    }

    const handleContinueShopping = () => {
        router.push('/product')
    }

    if (items.length === 0) {
        return <CartEmptyState onContinueShopping={handleContinueShopping} />
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 mb-32">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm border">
                {items.map((item) => (
                    <CartItem
                        key={`${item.id}-${item.color}`}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                    />
                ))}
            </div>

            {/* Cart Actions */}
            <CartActions
                onClearCart={clearCart}
                onContinueShopping={handleContinueShopping}
            />

            {/* Sticky Footer - Order Summary */}
            <CartStickyFooter
                totalPrice={getTotalPrice()}
                isCheckingOut={false}
                onContinueShopping={handleContinueShopping}
                onCheckout={handleCheckout}
            />
        </div>
    )
} 