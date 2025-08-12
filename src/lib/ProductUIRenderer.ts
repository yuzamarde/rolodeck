export class ProductUIRenderer {
    private static instance: ProductUIRenderer

    private constructor() { }

    static getInstance(): ProductUIRenderer {
        if (!ProductUIRenderer.instance) {
            ProductUIRenderer.instance = new ProductUIRenderer()
        }
        return ProductUIRenderer.instance
    }

    getProductGridConfig() {
        return {
            containerClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            itemClass: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
        }
    }

    getProductCardConfig() {
        return {
            imageContainerClass: 'aspect-square overflow-hidden',
            imageClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-300',
            contentClass: 'p-4',
            titleClass: 'text-lg font-semibold text-gray-900 mb-2',
            priceClass: 'text-2xl font-bold text-green-600',
            oldPriceClass: 'text-lg text-gray-400 line-through ml-2',
            buttonClass: 'w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
        }
    }

    getPageHeaderConfig() {
        return {
            containerClass: 'mb-8',
            titleClass: 'text-3xl font-bold text-gray-900 mb-2',
            subtitleClass: 'text-gray-600'
        }
    }

    getLoadingStateConfig() {
        return {
            containerClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            skeletonClass: 'bg-white rounded-lg shadow-sm border border-gray-200 p-4'
        }
    }

    getErrorStateConfig() {
        return {
            containerClass: 'text-center py-20',
            iconClass: 'text-red-500 text-6xl mb-4',
            titleClass: 'text-2xl font-bold text-gray-900 mb-2',
            messageClass: 'text-gray-600 mb-4',
            buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
        }
    }

    getEmptyStateConfig() {
        return {
            containerClass: 'text-center py-20',
            iconClass: 'text-gray-400 text-6xl mb-4',
            titleClass: 'text-2xl font-bold text-gray-900 mb-2',
            messageClass: 'text-gray-600 mb-4',
            buttonClass: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
        }
    }
} 