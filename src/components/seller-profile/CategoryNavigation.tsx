import Link from 'next/link';

interface CategoryNavigationProps {
    categories: string[];
    activeTab: string;
    activeCategory?: string;
    sellerId: string;
}

export default function CategoryNavigation({
    categories,
    activeTab,
    activeCategory,
    sellerId
}: CategoryNavigationProps) {
    return (
        <div className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex space-x-0 overflow-x-auto">
					<Link
                        href={`/market/seller-profile/${sellerId}?tab=todos`}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'todos'
                            ? 'text-green-600 border-green-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Todos
                    </Link>

                    {categories.map((category) => (
                        <Link
                            key={category}
                            href={`/market/seller-profile/${sellerId}?tab=categoria&category=${encodeURIComponent(
                                category
                            )}`}
                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'categoria' && activeCategory === category
                                ? 'text-green-600 border-green-600'
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}