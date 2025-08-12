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

        const ORDERS_RANGE = 'products-order!A:M'  // All columns including status

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

        // Fetch data from Google Sheets
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ORDERS_RANGE}`

        const sheetsResponse = await fetch(sheetsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        })

        if (!sheetsResponse.ok) {
            const sheetsError = await sheetsResponse.text()
            return NextResponse.json({
                success: false,
                error: 'Failed to fetch data from Google Sheets',
                details: sheetsError
            }, { status: 500 })
        }

        const sheetsResult = await sheetsResponse.json()
        const rawData = sheetsResult.values || []

        // Process the data - first row is headers, rest is data
        if (rawData.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No orders found',
                orders: [],
                totalOrders: 0
            })
        }

        const headers = rawData[0]
        const orderRows = rawData.slice(1) // Skip header row

        // Group orders by Order ID (since each product creates a separate row)
        const ordersMap = new Map()

        orderRows.forEach((row: string[]) => {
            const orderId = row[0] // Column A: Order ID

            if (!ordersMap.has(orderId)) {
                // Create new order entry
                ordersMap.set(orderId, {
                    orderId: row[0],
                    orderDate: row[1],
                    customerName: row[2],
                    email: row[3],
                    streetAddress: row[4],
                    houseNumber: row[5],
                    postalCode: row[6],
                    products: [],
                    totalAmount: parseFloat(row[11]) || 0,
                    status: row[12] || 'Unknown'
                })
            }

            // Add product to existing order
            const order = ordersMap.get(orderId)
            order.products.push({
                name: row[7],
                price: parseFloat(row[8]) || 0,
                quantity: parseInt(row[9]) || 0,
                color: row[10]
            })
        })

        // Convert map to array
        const orders = Array.from(ordersMap.values())

        // Sort orders by date (newest first)
        orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

        return NextResponse.json({
            success: true,
            message: 'Orders fetched successfully',
            orders: orders,
            totalOrders: orders.length,
            headers: headers,
            rawDataLength: rawData.length,
            processedRows: orderRows.length
        })

    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 