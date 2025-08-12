"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TestResultData {
    success?: boolean
    error?: string
    message?: string
    [key: string]: unknown
}

interface TestResult {
    status?: number
    data?: TestResultData
    error?: string
    timestamp: string
}

export default function TestAPIPage() {
    const [results, setResults] = useState<Record<string, TestResult>>({})
    const [loading, setLoading] = useState<string | null>(null)

    const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
        setLoading(endpoint)
        try {
            const response = await fetch(`/api/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                ...(method === 'POST' && {
                    body: JSON.stringify({
                        test: true,
                        timestamp: new Date().toISOString()
                    })
                })
            })

            const data = await response.json()
            setResults((prev: Record<string, TestResult>) => ({
                ...prev,
                [endpoint]: {
                    status: response.status,
                    data,
                    timestamp: new Date().toLocaleTimeString()
                }
            }))
        } catch (error) {
            setResults((prev: Record<string, TestResult>) => ({
                ...prev,
                [endpoint]: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toLocaleTimeString()
                }
            }))
        } finally {
            setLoading(null)
        }
    }

    const testSubmitOrder = async () => {
        setLoading('submit-order')
        try {
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
                'Test'
            ])

            const response = await fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderData: testOrderData, items: testRows })
            })

            const data = await response.json()
            setResults((prev: Record<string, TestResult>) => ({
                ...prev,
                'submit-order': {
                    status: response.status,
                    data,
                    timestamp: new Date().toLocaleTimeString()
                }
            }))
        } catch (error) {
            setResults((prev: Record<string, TestResult>) => ({
                ...prev,
                'submit-order': {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toLocaleTimeString()
                }
            }))
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">API Testing Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
                        <div className="space-y-3">
                            <Button
                                onClick={() => testEndpoint('fetch-orders')}
                                disabled={loading === 'fetch-orders'}
                                className="w-full"
                            >
                                {loading === 'fetch-orders' ? 'Testing...' : 'Test Fetch Orders'}
                            </Button>

                            <Button
                                onClick={() => testEndpoint('submit-order')}
                                disabled={loading === 'submit-order'}
                                className="w-full"
                            >
                                {loading === 'submit-order' ? 'Testing...' : 'Test Submit Order (GET)'}
                            </Button>

                            <Button
                                onClick={testSubmitOrder}
                                disabled={loading === 'submit-order'}
                                className="w-full"
                            >
                                {loading === 'submit-order' ? 'Testing...' : 'Test Submit Order (POST)'}
                            </Button>

                            <Button
                                onClick={() => testEndpoint('setup-headers')}
                                disabled={loading === 'setup-headers'}
                                className="w-full"
                            >
                                {loading === 'setup-headers' ? 'Testing...' : 'Test Setup Headers'}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Spreadsheet ID:</span>
                                <span className="font-mono text-xs">
                                    {process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID ? '✅ Set' : '❌ Missing'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service Account:</span>
                                <span className="font-mono text-xs">
                                    {process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Private Key:</span>
                                <span className="font-mono text-xs">
                                    {process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                    <div className="space-y-4">
                        {Object.entries(results).map(([endpoint, result]: [string, TestResult]) => (
                            <div key={endpoint} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">{endpoint}</h3>
                                <div className="text-sm text-gray-600 mb-2">
                                    Tested at: {result.timestamp}
                                </div>
                                {result.status && (
                                    <div className="mb-2">
                                        <span className="font-medium">Status:</span> {result.status}
                                    </div>
                                )}
                                {result.error ? (
                                    <div className="text-red-600">
                                        <span className="font-medium">Error:</span> {result.error}
                                    </div>
                                ) : (
                                    <div className="text-green-600">
                                        <span className="font-medium">Success!</span>
                                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 