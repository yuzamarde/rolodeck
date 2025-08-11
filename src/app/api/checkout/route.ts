import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia'
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
        const totalAmount = items.reduce((sum: number, item: any) => {
            return sum + (item.price * item.quantity)
        }, 0)

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                customerEmail,
                items: JSON.stringify(items.map((item: any) => ({
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