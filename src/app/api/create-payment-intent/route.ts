import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Check if Stripe secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Only initialize Stripe if the key is available
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
    apiVersion: '2025-07-30.basil',
}) : null

export async function POST(request: Request) {
    try {
        // Check if Stripe is properly configured
        if (!stripe) {
            return NextResponse.json(
                { error: 'Stripe is not configured. Please check your environment variables.' },
                { status: 500 }
            )
        }

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