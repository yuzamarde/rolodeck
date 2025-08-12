"use client"

interface ErrorStateProps {
    error: string
    onRefresh: () => void
}

export default function ErrorState({ error, onRefresh }: ErrorStateProps) {
    return (
        <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
                onClick={onRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
                Try Again
            </button>
        </div>
    )
} 