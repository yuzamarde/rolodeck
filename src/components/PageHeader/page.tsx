"use client"

interface PageHeaderProps {
    title?: string
}

export default function PageHeader({ title = "Breville" }: PageHeaderProps) {
    return (
        <h1 className="text-4xl sm:px-12 lg:px-10 font-medium text-gray-900 mt-24">
            {title}
        </h1>
    )
} 