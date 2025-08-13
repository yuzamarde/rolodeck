import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Helper function to properly format the private key
function formatPrivateKey(privateKey: string): string {
    // Remove any existing formatting and ensure proper line breaks
    return privateKey
        .replace(/\\n/g, '\n')
        .replace(/"/g, '')
        .trim()
}

export async function GET() {
    try {
        const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
        const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

        if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Service account credentials not configured',
                missing: {
                    SPREADSHEET_ID: !SPREADSHEET_ID,
                    SERVICE_ACCOUNT_EMAIL: !SERVICE_ACCOUNT_EMAIL,
                    PRIVATE_KEY: !PRIVATE_KEY
                }
            }, { status: 500 })
        }

        // Test data for GET request
        const testData = [
            [
                `TEST-${Date.now()}`,
                new Date().toISOString(),
                'Test Customer',
                'test@example.com',
                'Test Street',
                '123',
                '12345',
                'Test Product',
                99.99,
                1,
                'Test Color',
                99.99,
                'Test'
            ]
        ]

        const ORDERS_RANGE = 'products-order!A:M'

        // Format the private key properly
        const formattedPrivateKey = formatPrivateKey(PRIVATE_KEY)

        // Generate JWT token for OAuth2 authentication
        const now = Math.floor(Date.now() / 1000)
        const payload = {
            iss: SERVICE_ACCOUNT_EMAIL,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        }

        // Create properly signed JWT token
        const jwtToken = jwt.sign(payload, formattedPrivateKey, {
            algorithm: 'RS256'
        })

        // Get access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwtToken
            })
        })

        if (!tokenResponse.ok) {
            const tokenError = await tokenResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to get access token',
                details: tokenError
            }, { status: 500 })
        }

        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        // Append test data to Google Sheets
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ORDERS_RANGE}:append?valueInputOption=RAW`

        const sheetsResponse = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: testData
            })
        })

        if (!sheetsResponse.ok) {
            const sheetsError = await sheetsResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to append test data to Google Sheets',
                details: sheetsError
            }, { status: 500 })
        }

        const sheetsResult = await sheetsResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Test data submitted successfully to Google Sheets',
            testData: testData,
            orderId: testData[0][0],
            rowsAdded: testData.length,
            sheetsResult: sheetsResult,
            credentials: {
                spreadsheetId: SPREADSHEET_ID,
                serviceAccountEmail: SERVICE_ACCOUNT_EMAIL,
                hasPrivateKey: !!PRIVATE_KEY,
                privateKeyLength: PRIVATE_KEY.length,
                formattedPrivateKeyLength: formattedPrivateKey.length
            }
        })

    } catch (error) {
        console.error('Error in GET submit-order:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { orderData, items } = await request.json()

        const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
        const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

        if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Service account credentials not configured'
            }, { status: 500 })
        }

        const ORDERS_RANGE = 'products-order!A:M'  // Updated to include status column

        // Format the private key properly
        const formattedPrivateKey = formatPrivateKey(PRIVATE_KEY)

        // Generate JWT token for OAuth2 authentication
        const now = Math.floor(Date.now() / 1000)
        const payload = {
            iss: SERVICE_ACCOUNT_EMAIL,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600, // 1 hour
            iat: now
        }

        // Create properly signed JWT token
        const jwtToken = jwt.sign(payload, formattedPrivateKey, {
            algorithm: 'RS256'
        })

        // Get access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwtToken
            })
        })

        if (!tokenResponse.ok) {
            const tokenError = await tokenResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to get access token',
                details: tokenError
            }, { status: 500 })
        }

        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        // Append order data to Google Sheets
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ORDERS_RANGE}:append?valueInputOption=RAW`

        const sheetsResponse = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: items
            })
        })

        if (!sheetsResponse.ok) {
            const sheetsError = await sheetsResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to append order to Google Sheets',
                details: sheetsError
            }, { status: 500 })
        }

        const sheetsResult = await sheetsResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Order submitted successfully',
            orderId: orderData.orderId,
            rowsAdded: items.length,
            sheetsResult: sheetsResult
        })

    } catch (error) {
        console.error('Error submitting order:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 