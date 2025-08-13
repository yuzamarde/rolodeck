"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import OrderDetailsHeader from '@/components/OrderDetailsHeader/page'
import OrderCard from '@/components/OrderCard/page'
import OrderNextSteps from '@/components/OrderNextSteps/page'
import OrderActions from '@/components/OrderActions/page'
import OrderLoadingState from '@/components/OrderLoadingState/page'
import OrderErrorState from '@/components/OrderErrorState/page'

interface OrderData {
    orderId: string
    orderDate: string
    customerName: string
    email: string
    streetAddress: string
    houseNumber: string
    postalCode: string
    totalAmount: number
    products: Array<{
        name: string
        price: number
        quantity: number
        color: string
    }>
    status: string
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [orderData, setOrderData] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<any>(null)

    useEffect(() => {
        const orderId = params.orderId as string

        if (!orderId) {
            router.push('/cart')
            return
        }

        const fetchOrderData = async () => {
            try {
                console.log('Fetching order data for orderId:', orderId)

                const response = await fetch('/api/fetch-orders')
                console.log('Response status:', response.status)

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`)
                }

                const result = await response.json()
                console.log('Fetch orders result:', result)

                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch orders')
                }

                // Debug: Log all orders to see what we're working with
                console.log('All orders:', result.orders)
                console.log('Looking for orderId:', orderId)

                const foundOrder = result.orders.find((order: OrderData) => {
                    console.log('Checking order:', order.orderId, 'against:', orderId, 'Match:', order.orderId === orderId)
                    return order.orderId === orderId
                })

                console.log('Found order:', foundOrder)

                if (foundOrder) {
                    setOrderData(foundOrder)
                    setDebugInfo({
                        totalOrders: result.totalOrders,
                        orderId,
                        foundOrderId: foundOrder.orderId,
                        allOrderIds: result.orders.map((o: OrderData) => o.orderId)
                    })
                } else {
                    setError(`Order not found. Available orders: ${result.orders.map((o: OrderData) => o.orderId).join(', ')}`)
                    setDebugInfo({
                        totalOrders: result.totalOrders,
                        orderId,
                        allOrderIds: result.orders.map((o: OrderData) => o.orderId),
                        result: result
                    })
                }
            } catch (error) {
                console.error('Failed to fetch order data:', error)
                setError(error instanceof Error ? error.message : 'Failed to fetch order data')
                setDebugInfo({ error: error })
            } finally {
                setLoading(false)
            }
        }

        fetchOrderData()
    }, [params.orderId, router])

    const handleBackToHome = () => {
        router.push('/')
    }

    if (loading) {
        return <OrderLoadingState />
    }

    if (error || !orderData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <OrderErrorState error={error || 'Order not found'} />

                    {/* Debug Information */}
                    {debugInfo && (
                        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">Debug Information</h3>
                            <pre className="text-sm text-yellow-700 overflow-auto">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <OrderDetailsHeader />
                <OrderCard
                    orderId={orderData.orderId}
                    orderDate={orderData.orderDate}
                    customerName={orderData.customerName}
                    email={orderData.email}
                    streetAddress={orderData.streetAddress}
                    houseNumber={orderData.houseNumber}
                    postalCode={orderData.postalCode}
                    totalAmount={orderData.totalAmount}
                    products={orderData.products}
                    status={orderData.status}
                />
                <OrderNextSteps />
                <OrderActions onContinueShopping={handleBackToHome} />
            </div>
        </div>
    )
} 