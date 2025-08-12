"use client"

import { Product } from '@/lib/ProductManager'
import ProductCard from '@/components/ProductCard/page'

interface ProductGridProps {
    products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return null
    }

    return (
        <div className="w-full mx-auto sm:px-12 lg:px-10 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
} 