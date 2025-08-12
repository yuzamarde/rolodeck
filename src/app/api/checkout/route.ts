import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil'
})

export async function POST(request: NextRequest) {
    try {
        const { items, customerEmail } = await request.json()

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items provided' },
                { status: 400 }
            )
        }

        // Calculate total amount
        const totalAmount = items.reduce((sum: number, item: CartItem) => {
            return sum + (item.price * item.quantity)
        }, 0)

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                customerEmail,
                items: JSON.stringify(items.map((item: CartItem) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity
                })))
            }
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret
        })

    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
} 