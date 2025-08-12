"use client"

import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar/page'
import { useRouter } from 'next/navigation'

interface OrderErrorStateProps {
    error: string
}

export default function OrderErrorState({ error }: OrderErrorStateProps) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The order you are looking for could not be found.'}</p>
                    <Button
                        onClick={() => router.push('/cart')}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                    >
                        Back to Cart
                    </Button>
                </div>
            </div>
        </div>
    )
} 