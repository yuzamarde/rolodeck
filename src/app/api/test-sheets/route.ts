import { NextResponse } from 'next/server'

interface SheetProperties {
    title?: string
}

interface Sheet {
    properties?: SheetProperties
}

export async function GET() {
    try {
        const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
        const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID

        if (!GOOGLE_SHEETS_API_KEY || !SPREADSHEET_ID) {
            return NextResponse.json({
                error: 'Missing environment variables',
                hasApiKey: !!GOOGLE_SHEETS_API_KEY,
                hasSpreadsheetId: !!SPREADSHEET_ID,
                apiKeyLength: GOOGLE_SHEETS_API_KEY?.length || 0,
                spreadsheetId: SPREADSHEET_ID || 'missing'
            }, { status: 400 })
        }

        // Test 1: Try to read the spreadsheet (simpler than append)
        const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`

        const readResponse = await fetch(readUrl)

        if (!readResponse.ok) {
            const errorText = await readResponse.text()
            return NextResponse.json({
                error: 'Failed to read spreadsheet',
                status: readResponse.status,
                statusText: readResponse.statusText,
                errorDetails: errorText,
                apiKeyLength: GOOGLE_SHEETS_API_KEY.length,
                spreadsheetId: SPREADSHEET_ID,
                testUrl: readUrl.replace(GOOGLE_SHEETS_API_KEY, 'HIDDEN')
            }, { status: readResponse.status })
        }

        const readData = await readResponse.json()

        // Test 2: Try to get sheet names
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/sheets?key=${GOOGLE_SHEETS_API_KEY}`
        const sheetsResponse = await fetch(sheetsUrl)

        if (!sheetsResponse.ok) {
            const sheetsErrorText = await sheetsResponse.text()
            return NextResponse.json({
                error: 'Failed to get sheet names',
                status: sheetsResponse.status,
                statusText: sheetsResponse.statusText,
                errorDetails: sheetsErrorText,
                readSuccess: true,
                spreadsheetTitle: readData.properties?.title || 'Unknown'
            }, { status: sheetsResponse.status })
        }

        const sheetsData = await sheetsResponse.json()

        return NextResponse.json({
            success: true,
            message: 'Google Sheets API connection successful',
            spreadsheetTitle: readData.properties?.title || 'Unknown',
            spreadsheetId: SPREADSHEET_ID,
            sheets: sheetsData.sheets?.map((sheet: Sheet) => sheet.properties?.title) || [],
            apiKeyLength: GOOGLE_SHEETS_API_KEY.length,
            readStatus: readResponse.status,
            sheetsStatus: sheetsResponse.status
        })

    } catch (error) {
        return NextResponse.json({
            error: 'Unexpected error',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
} 