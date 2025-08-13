import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
        
        if (!PRIVATE_KEY) {
            return NextResponse.json({
                success: false,
                error: 'GOOGLE_PRIVATE_KEY not found in environment variables'
            }, { status: 500 })
        }

        // Test different formatting approaches
        const originalLength = PRIVATE_KEY.length
        const withoutQuotes = PRIVATE_KEY.replace(/"/g, '')
        const withNewlines = PRIVATE_KEY.replace(/\\n/g, '\n')
        const fullyFormatted = PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').trim()

        return NextResponse.json({
            success: true,
            message: 'Private key analysis',
            analysis: {
                originalLength,
                withoutQuotesLength: withoutQuotes.length,
                withNewlinesLength: withNewlines.length,
                fullyFormattedLength: fullyFormatted.length,
                hasQuotes: PRIVATE_KEY.includes('"'),
                hasEscapedNewlines: PRIVATE_KEY.includes('\\n'),
                startsWithBegin: PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----'),
                endsWithEnd: PRIVATE_KEY.includes('-----END PRIVATE KEY-----'),
                sampleStart: PRIVATE_KEY.substring(0, 50),
                sampleEnd: PRIVATE_KEY.substring(PRIVATE_KEY.length - 50)
            },
            formattedKey: fullyFormatted
        })

    } catch (error) {
        console.error('Error testing private key:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 