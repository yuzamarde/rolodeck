import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET() {
    try {
        const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
        const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

        if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
            return NextResponse.json({
                error: 'Missing service account credentials',
                hasSpreadsheetId: !!SPREADSHEET_ID,
                hasServiceAccount: !!SERVICE_ACCOUNT_EMAIL,
                hasPrivateKey: !!PRIVATE_KEY
            }, { status: 400 })
        }

        // Test data - simple test row
        const testData = [
            [
                'TEST-' + Date.now(),
                new Date().toISOString(),
                'Test Customer',
                'test@example.com',
                'Test Address',
                'Test House',
                '12345',
                'Test Product',
                29.99,
                1,
                'Test Color',
                29.99
            ]
        ]

        const ORDERS_RANGE = 'products-order!A:L'

        // Generate JWT token for OAuth2 authentication using proper library
        const now = Math.floor(Date.now() / 1000)
        const payload = {
            iss: SERVICE_ACCOUNT_EMAIL,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600, // 1 hour
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
                error: 'Failed to get access token',
                status: tokenResponse.status,
                errorDetails: tokenError,
                jwtTokenLength: jwtToken.length,
                serviceAccountEmail: SERVICE_ACCOUNT_EMAIL
            }, { status: tokenResponse.status })
        }

        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        // Now append data to Google Sheets using the access token
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
                error: 'Failed to append data to Google Sheets',
                status: sheetsResponse.status,
                errorDetails: sheetsError,
                accessTokenReceived: !!accessToken,
                accessTokenLength: accessToken?.length || 0
            }, { status: sheetsResponse.status })
        }

        const sheetsResult = await sheetsResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Data successfully appended to Google Sheets!',
            testData: testData,
            spreadsheetId: SPREADSHEET_ID,
            range: ORDERS_RANGE,
            serviceAccountEmail: SERVICE_ACCOUNT_EMAIL,
            hasPrivateKey: !!PRIVATE_KEY,
            accessTokenReceived: !!accessToken,
            accessTokenLength: accessToken?.length || 0,
            sheetsResult: sheetsResult
        })

    } catch (error) {
        return NextResponse.json({
            error: 'Unexpected error',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
} 