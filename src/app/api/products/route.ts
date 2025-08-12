import { NextResponse } from 'next/server'

interface Product {
    id: number
    slug: string
    name: string
    oldPrice: number
    price: number
    colors: string[]
    description: string
    features: string[]
    images: string[]
}

export async function GET() {
    try {
        const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY
        const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
        const RANGE = 'products-template!A:J'

        if (!GOOGLE_SHEETS_API_KEY || !SPREADSHEET_ID) {
            throw new Error('Google Sheets API credentials not configured')
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()

        if (!data.values || data.values.length < 2) {
            throw new Error('No data found in spreadsheet')
        }

        // Transform the data from Google Sheets format to our Product interface
        const products: Product[] = data.values.slice(1).map((row: string[], index: number) => {
            const [id, slug, name, oldPrice, price, colors, description, features, images] = row

            return {
                id: parseInt(id) || index + 1,
                slug: slug || `product-${index + 1}`,
                name: name || 'Unnamed Product',
                oldPrice: parseFloat(oldPrice) || 0,
                price: parseFloat(price) || 0,
                colors: colors ? colors.split(',').map(c => c.trim()).filter(Boolean) : ['Default'],
                description: description || 'No description available',
                features: features ? features.split(',').map(f => f.trim()).filter(Boolean) : [],
                images: images ? images.split(',').map(img => img.trim()).filter(Boolean) : []
            }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error('Failed to fetch products from Google Sheets:', error)

        // Return more detailed error information for debugging
        return NextResponse.json(
            {
                error: 'Failed to fetch products',
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        )
    }
} 