"use client"

export default function OrderNextSteps() {
    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What&apos;s Next?</h3>
            <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>You will receive an order confirmation email shortly.</p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Our team will process your order and contact you if needed.</p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Track your order status using the order number above.</p>
                </div>
            </div>
        </div>
    )
} 