"use client"

import Navbar from '@/components/Navbar/page'

export default function PaymentNoOrderState() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">No order data found</div>
            </div>
        </div>
    )
} 