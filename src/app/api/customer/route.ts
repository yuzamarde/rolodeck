import { NextRequest, NextResponse } from 'next/server'
import { google, sheets_v4 } from 'googleapis'

// Check if required environment variables are available
const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY
const googleSheetId = process.env.GOOGLE_SPREADSHEET_ID

// Only initialize Google Sheets if all required credentials are available
let sheets: sheets_v4.Sheets | null = null

if (googleServiceAccountEmail && googlePrivateKey && googleSheetId) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: googleServiceAccountEmail,
                private_key: googlePrivateKey.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })
        sheets = google.sheets({ version: 'v4', auth })
    } catch (error) {
        console.error('Failed to initialize Google Sheets:', error)
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check if Google Sheets is properly configured
        if (!sheets) {
            return NextResponse.json(
                { error: 'Google Sheets is not configured. Please check your environment variables.' },
                { status: 500 }
            )
        }

        const { name, email, phone, message, productInterest } = await request.json()

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            )
        }

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
            spreadsheetId: googleSheetId,
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