import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Google Sheets API configuration
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message, productInterest } = await request.json()

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            )
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID
        const range = 'Sheet1!A:F' // Adjust range as needed

        const values = [
            [
                new Date().toISOString(), // Timestamp
                name,
                email,
                phone || '',
                message || '',
                productInterest || ''
            ]
        ]

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Customer data saved successfully'
        })

    } catch (error) {
        console.error('Customer API error:', error)
        return NextResponse.json(
            { error: 'Failed to save customer data' },
            { status: 500 }
        )
    }
} 