import { NextResponse } from 'next/server'

export async function GET() {
    // Check environment variables (without exposing sensitive values)
    const envCheck = {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasStripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasGoogleKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasGoogleSheet: !!process.env.GOOGLE_SPREADSHEET_ID,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'local'
    }

    return NextResponse.json({
        message: 'Environment variables check',
        environment: envCheck,
        timestamp: new Date().toISOString()
    })
} 