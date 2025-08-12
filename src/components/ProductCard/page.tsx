"use client"

import Link from 'next/link'
import { Product } from '@/lib/ProductManager'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.slug}`}>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative h-100 overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 border-2 border-gray-200 rounded-xl"
                    />
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-normal text-gray-900">
                            {product.name}
                        </h3>
                        <span className="text-xl font-normal">
                            ${product.price}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-6 line-clamp-2">
                        {product.description}
                    </p>
                </div>
            </div>
        </Link>
    )
} 