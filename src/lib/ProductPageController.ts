import { ProductManager, Product } from './ProductManager'
import { ProductUIRenderer } from './ProductUIRenderer'

export class ProductPageController {
    private productManager: ProductManager
    private uiRenderer: ProductUIRenderer
    private currentProducts: Product[] = []
    private searchQuery: string = ''

    constructor() {
        this.productManager = new ProductManager()
        this.uiRenderer = ProductUIRenderer.getInstance()
    }

    // Initialize the page
    async initialize(): Promise<void> {
        await this.productManager.fetchProducts()
        this.currentProducts = this.productManager.getProducts()
    }

    // Get current state
    getState() {
        return {
            products: this.currentProducts,
            loading: this.productManager.isLoading(),
            error: this.productManager.getError(),
            productCount: this.productManager.getProductCount(),
            searchQuery: this.searchQuery
        }
    }

    // Search products
    searchProducts(query: string): void {
        this.searchQuery = query
        if (query.trim()) {
            this.currentProducts = this.productManager.searchProducts(query)
        } else {
            this.currentProducts = this.productManager.getProducts()
        }
    }

    // Filter products by category
    filterByCategory(category: string): void {
        this.currentProducts = this.productManager.getProductsByCategory(category)
    }

    // Get discounted products only
    showDiscountedOnly(): void {
        this.currentProducts = this.productManager.getDiscountedProducts()
    }

    // Reset to show all products
    resetFilters(): void {
        this.currentProducts = this.productManager.getProducts()
        this.searchQuery = ''
    }

    // Refresh products
    async refreshProducts(): Promise<void> {
        await this.productManager.fetchProducts()
        this.currentProducts = this.productManager.getProducts()
    }

    // Get UI configurations
    getUIConfigs() {
        return {
            productGrid: this.uiRenderer.getProductGridConfig(),
            productCard: this.uiRenderer.getProductCardConfig(),
            pageHeader: this.uiRenderer.getPageHeaderConfig(),
            loadingState: this.uiRenderer.getLoadingStateConfig(),
            errorState: this.uiRenderer.getErrorStateConfig(),
            emptyState: this.uiRenderer.getEmptyStateConfig()
        }
    }

    // Get product by slug for navigation
    getProductBySlug(slug: string): Product | undefined {
        return this.productManager.getProductBySlug(slug)
    }

    // Cleanup
    destroy(): void {
        this.productManager.reset()
        this.currentProducts = []
        this.searchQuery = ''
    }
} 