"use client"

interface OrderItem {
    name: string
    price: number
    quantity: number
    color: string
}

interface OrderCardProps {
    orderId: string
    orderDate: string
    customerName: string
    email: string
    streetAddress: string
    houseNumber: string
    postalCode: string
    totalAmount: number
    products: OrderItem[]
    status: string
}

export default function OrderCard({
    orderId,
    orderDate,
    customerName,
    email,
    streetAddress,
    houseNumber,
    postalCode,
    totalAmount,
    products,
    status
}: OrderCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'confirmed':
                return 'bg-green-100 text-green-800'
            case 'shipped':
                return 'bg-blue-100 text-blue-800'
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Order #{orderId}</h2>
                        <p className="text-sm text-gray-600">Placed on {formatDate(orderDate)}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Status</div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status || 'Unknown'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900">{customerName}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-gray-900">{streetAddress}</p>
                        {houseNumber && houseNumber !== 'N/A' && (
                            <p className="text-gray-900">{houseNumber}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Postal Code</label>
                        <p className="text-gray-900">{postalCode}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
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
                                <div className="text-sm text-gray-500">
                                    ${item.price} each
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">SGD ${totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
} 