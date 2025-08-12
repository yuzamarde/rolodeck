import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // Test the complete flow
        const testOrderData = {
            orderId: `TEST-${Date.now()}`,
            orderDate: new Date().toISOString(),
            customerName: 'Test Customer',
            email: 'test@example.com',
            streetAddress: 'Test Street',
            houseNumber: '123',
            postalCode: '12345',
            totalAmount: 99.99,
            products: [
                {
                    name: 'Test Product',
                    price: 99.99,
                    quantity: 1,
                    color: 'Test Color'
                }
            ]
        }

        const testRows = testOrderData.products.map(item => [
            testOrderData.orderId,
            testOrderData.orderDate,
            testOrderData.customerName,
            testOrderData.email,
            testOrderData.streetAddress,
            testOrderData.houseNumber,
            testOrderData.postalCode,
            item.name,
            item.price,
            item.quantity,
            item.color,
            testOrderData.totalAmount,
            'Test' // Status for testing
        ])

        return NextResponse.json({
            success: true,
            message: 'Payment flow test data generated',
            testOrder: testOrderData,
            testRows: testRows,
            instructions: [
                '1. Use this test data to verify Google Sheets submission',
                '2. Check that the /api/submit-order endpoint works',
                '3. Verify data appears in your Google Sheet',
                '4. Test the complete payment flow end-to-end'
            ]
        })

    } catch (error) {
        console.error('Error in test payment flow:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to generate test data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
} 