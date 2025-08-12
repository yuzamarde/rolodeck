import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST() {
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

        // Test data
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
        const jwtToken = jwt.sign(payload, PRIVATE_KEY, {
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

        // Test append to Google Sheets
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ORDERS_RANGE}:append?valueInputOption=RAW`

        const sheetsResponse = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: testData })
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
            message: 'Test data successfully appended to Google Sheets!',
            testData: testData,
            sheetsResult: sheetsResult,
            credentials: {
                spreadsheetId: SPREADSHEET_ID,
                serviceAccountEmail: SERVICE_ACCOUNT_EMAIL,
                hasPrivateKey: !!PRIVATE_KEY
            }
        })

    } catch (error) {
        console.error('Error in test submit order:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 