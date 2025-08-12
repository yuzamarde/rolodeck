"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import ProductDetailSkeleton from '@/components/Skeleton/ProductDetailSkeleton/page'
import ProductImageGallery from '@/components/ProductImageGallery/page'
import ProductDetails from '@/components/ProductDetails/page'
import ProductStickyFooter from '@/components/ProductStickyFooter/page'

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

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { addToCart } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedColor, setSelectedColor] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (params.slug) {
            fetchProduct(params.slug as string)
        }
    }, [params.slug])

    const fetchProduct = async (slug: string) => {
        try {
            const response = await fetch('/api/products')
            const products = await response.json()
            const foundProduct = products.find((p: Product) => p.slug === slug)
            if (foundProduct) {
                setProduct(foundProduct)
            }
        } catch (error) {
            console.error('Failed to fetch product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleColorSelect = (colorIndex: number) => {
        setSelectedColor(colorIndex)
    }

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
    }

    const handleAddToCart = () => {
        if (product) {
            const selectedColorName = product.colors[selectedColor]
            addToCart(product, quantity, selectedColorName)

            // Show success message or redirect to cart
            router.push('/cart')
        }
    }

    // Show skeleton while loading
    if (loading) {
        return <ProductDetailSkeleton />
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Product not found</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ gridTemplateColumns: '40% 60%' }}>

                {/* Left Section - Image Gallery */}
                <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                />

                {/* Right Section - Product Details */}
                <ProductDetails
                    product={product}
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                />
            </div>

            {/* Sticky Footer - Add to Cart */}
            <ProductStickyFooter
                price={product.price}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
            />
        </div>
    )
} 