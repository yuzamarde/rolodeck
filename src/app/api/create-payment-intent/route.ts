import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-07-30.basil',
})

export async function POST(request: Request) {
    try {
        const { amount, orderId, customerEmail, customerName } = await request.json()

        // Validate required fields
        if (!amount || !orderId || !customerEmail) {
            return NextResponse.json(
                { error: 'Missing required fields: amount, orderId, customerEmail' },
                { status: 400 }
            )
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'sgd',
            metadata: {
                orderId,
                customerEmail,
                customerName: customerName || 'Unknown',
            },
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error) {
        console.error('Error creating payment intent:', error)
        return NextResponse.json(
            { error: 'Failed to create payment intent' },
            { status: 500 }
        )
    }
} 