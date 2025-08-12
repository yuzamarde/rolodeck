// Order Service - Handles order submission to Google Sheets

interface OrderItem {
    id: number
    name: string
    price: number
    quantity: number
    color?: string
}

interface CustomerInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

interface Order {
    orderId: string
    customer: CustomerInfo
    items: OrderItem[]
    totalAmount: number
    orderDate: string
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
    paymentMethod: string
    notes?: string
}

/**
 * Submit order to Google Sheets for tracking
 */
export async function submitOrder(order: Order): Promise<boolean> {
    try {
        const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY
        const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID
        const ORDERS_RANGE = 'Orders!A:Z' // New sheet for orders

        if (!GOOGLE_SHEETS_API_KEY || !SPREADSHEET_ID) {
            throw new Error('Google Sheets API credentials not configured')
        }

        // Prepare order data for Google Sheets
        const orderRow = [
            order.orderId,
            order.orderDate,
            `${order.customer.firstName} ${order.customer.lastName}`,
            order.customer.email,
            order.customer.phone,
            order.customer.address,
            order.customer.city,
            order.customer.state,
            order.customer.zipCode,
            order.customer.country,
            order.totalAmount,
            order.status,
            order.paymentMethod,
            order.notes || '',
            // Items as JSON string (you can expand this to multiple columns if needed)
            JSON.stringify(order.items)
        ]

        // Use Google Sheets API to append the order
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${ORDERS_RANGE}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [orderRow]
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
        }

        return true
    } catch (error) {
        console.error('Failed to submit order to Google Sheets:', error)
        throw error
    }
}

/**
 * Generate unique order ID
 */
export function generateOrderId(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, 5)
    return `ORD-${timestamp}-${random}`.toUpperCase()
}

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    color?: string
}

/**
 * Format order data for submission
 */
export function formatOrderForSubmission(
    customerInfo: CustomerInfo,
    cartItems: CartItem[],
    paymentMethod: string,
    notes?: string
): Order {
    const orderId = generateOrderId()
    const orderDate = new Date().toISOString()

    const items: OrderItem[] = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color
    }))

    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    return {
        orderId,
        customer: customerInfo,
        items,
        totalAmount,
        orderDate,
        status: 'pending',
        paymentMethod,
        notes
    }
} 