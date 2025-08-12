"use client"

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
    onResetFilters: () => void
}

export default function EmptyState({ onResetFilters }: EmptyStateProps) {
    return (
        <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-4">We couldn&apos;t find any products matching your criteria.</p>
            <Button onClick={onResetFilters} className="bg-blue-500 hover:bg-blue-600">
                Show All Products
            </Button>
        </div>
    )
} 