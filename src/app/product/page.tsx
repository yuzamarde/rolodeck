"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import ProductSkeleton from '@/components/Skeleton/ProductSkeleton/page'
import PageHeader from '@/components/PageHeader/page'
import ProductGrid from '@/components/ProductGrid/page'
import EmptyState from '@/components/EmptyState/page'
import ErrorState from '@/components/ErrorState/page'
import { ProductPageController } from '@/lib/ProductPageController'

interface Product {
    id: number
    slug: string
    name: string
    oldPrice: number
    price: number
    colors: string[]
    description: string
    features: string[]
    images: string[]
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    // Initialize the controller with useMemo to prevent recreation on every render
    const controller = useMemo(() => new ProductPageController(), [])

    const initializePage = useCallback(async () => {
        try {
            await controller.initialize()
            const state = controller.getState()
            setProducts(state.products)
            setFilteredProducts(state.products)
        } catch (error) {
            setError('Failed to load products')
            console.error('Error initializing page:', error)
        } finally {
            setLoading(false)
        }
    }, [controller])

    useEffect(() => {
        initializePage()
    }, [initializePage])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
                <ProductSkeleton />
            ) : error ? (
                <ErrorState error={error} onRefresh={() => window.location.reload()} />
            ) : filteredProducts.length === 0 ? (
                <EmptyState onResetFilters={() => {
                    setFilteredProducts(products)
                }} />
            ) : (
                <>
                    <PageHeader title="All Products" />
                    <ProductGrid products={filteredProducts} />
                </>
            )}
        </div>
    )
}
