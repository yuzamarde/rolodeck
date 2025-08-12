"use client"

import { Button } from '@/components/ui/button'

interface ProductControlsProps {
    searchQuery: string
    productCount: number
    onSearch: (query: string) => void
    onFilterByCategory: (category: string) => void
    onShowDiscounted: () => void
    onResetFilters: () => void
}

export default function ProductControls({
    searchQuery,
    productCount,
    onSearch,
    onFilterByCategory,
    onShowDiscounted,
    onResetFilters
}: ProductControlsProps) {
    return (
        <div className="w-full mx-auto sm:px-12 lg:px-10 mt-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Search Bar */}
                <div className="flex-1 min-w-64">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={() => onFilterByCategory('espresso')}
                        variant="outline"
                        className="text-sm"
                    >
                        Espresso
                    </Button>
                    <Button
                        onClick={() => onFilterByCategory('coffee')}
                        variant="outline"
                        className="text-sm"
                    >
                        Coffee
                    </Button>
                    <Button
                        onClick={onShowDiscounted}
                        variant="outline"
                        className="text-sm"
                    >
                        On Sale
                    </Button>
                    <Button
                        onClick={onResetFilters}
                        variant="outline"
                        className="text-sm"
                    >
                        All Products
                    </Button>
                </div>

                {/* Product Count */}
                <div className="text-sm text-gray-600">
                    {productCount} products
                </div>
            </div>
        </div>
    )
} 