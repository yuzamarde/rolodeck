export interface Product {
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

export class ProductManager {
    private products: Product[] = []
    private loading: boolean = true
    private error: string | null = null

    constructor() {
        this.products = []
        this.loading = true
        this.error = null
    }

    // Getters
    getProducts(): Product[] {
        return this.products
    }

    isLoading(): boolean {
        return this.loading
    }

    getError(): string | null {
        return this.error
    }

    getProductCount(): number {
        return this.products.length
    }

    // Product operations
    async fetchProducts(): Promise<void> {
        try {
            this.loading = true
            this.error = null

            const response = await fetch('/api/products')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            this.products = data
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Failed to fetch products'
            console.error('Failed to fetch products:', error)
        } finally {
            this.loading = false
        }
    }

    getProductBySlug(slug: string): Product | undefined {
        return this.products.find(product => product.slug === slug)
    }

    getProductsByCategory(category: string): Product[] {
        // Filter products by category (can be extended based on your data structure)
        return this.products.filter(product =>
            product.name.toLowerCase().includes(category.toLowerCase()) ||
            product.description.toLowerCase().includes(category.toLowerCase())
        )
    }

    getDiscountedProducts(): Product[] {
        return this.products.filter(product => product.oldPrice > product.price)
    }

    // Search functionality
    searchProducts(query: string): Product[] {
        if (!query.trim()) return this.products

        const searchTerm = query.toLowerCase()
        return this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.features.some(feature =>
                feature.toLowerCase().includes(searchTerm)
            )
        )
    }

    // Reset state
    reset(): void {
        this.products = []
        this.loading = true
        this.error = null
    }
} 