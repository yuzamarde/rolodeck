import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET() {
    try {
        const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
        const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

        if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Service account credentials not configured'
            }, { status: 500 })
        }

        // Headers for the orders sheet
        const headers = [
            'Order ID',
            'Order Date',
            'Customer Name',
            'Email',
            'Street Address',
            'House Number',
            'Postal Code',
            'Product Name',
            'Product Price',
            'Quantity',
            'Color',
            'Total Amount',
            'Status'
        ]

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

        // Clear existing data and add headers
        const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/products-order!A1:Z1000:clear`

        const clearResponse = await fetch(clearUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })

        if (!clearResponse.ok) {
            const clearError = await clearResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to clear sheet',
                details: clearError
            }, { status: 500 })
        }

        // Add headers
        const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/products-order!A1:append?valueInputOption=RAW`

        const headersResponse = await fetch(headersUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [headers]
            })
        })

        if (!headersResponse.ok) {
            const headersError = await headersResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to add headers',
                details: headersError
            }, { status: 500 })
        }

        const headersResult = await headersResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Headers added successfully',
            headers: headers,
            result: headersResult
        })

    } catch (error) {
        console.error('Error setting up headers:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 