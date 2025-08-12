"use client"

interface OrderItem {
    name: string
    price: number
    quantity: number
    color: string
}

interface OrderSummaryProps {
    products: OrderItem[]
    totalAmount: number
    customerName: string
    streetAddress: string
    houseNumber: string
    postalCode: string
}

export default function OrderSummary({
    products,
    totalAmount,
    customerName,
    streetAddress,
    houseNumber,
    postalCode
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
                {products.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">
                                Color: {item.color} • Qty: {item.quantity}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium text-gray-900">
                                SGD ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">SGD ${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                    <p>{customerName}</p>
                    <p>{streetAddress}</p>
                    {houseNumber && houseNumber !== 'N/A' && (
                        <p>{houseNumber}</p>
                    )}
                    <p>{postalCode}</p>
                </div>
            </div>
        </div>
    )
} 