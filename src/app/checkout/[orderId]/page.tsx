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

    useEffect(() => {
        const orderId = params.orderId as string

        if (!orderId) {
            router.push('/cart')
            return
        }

        const fetchOrderData = async () => {
            try {
                const response = await fetch('/api/fetch-orders')
                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`)
                }

                const result = await response.json()

                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch orders')
                }

                const foundOrder = result.orders.find((order: OrderData) =>
                    order.orderId === orderId
                )

                if (foundOrder) {
                    setOrderData(foundOrder)
                } else {
                    setError('Order not found')
                }
            } catch (error) {
                console.error('Failed to fetch order data:', error)
                setError(error instanceof Error ? error.message : 'Failed to fetch order data')
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
        return <OrderErrorState error={error || 'Order not found'} />
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