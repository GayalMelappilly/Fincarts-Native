import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export interface TopFishListing {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    isFeatured: boolean;
    viewCount: number;
    reviewCount: number;
    createdAt: string;
}

const ViewProductsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [products, setProducts] = useState<TopFishListing[]>()

    const { sellerData } = useAuth()

    useEffect(() => {
        setProducts(sellerData?.topFishListings)
    }, [sellerData])

    const filteredProducts = products?.filter((product: TopFishListing) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = filteredProducts && Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts && filteredProducts.slice(startIndex, endIndex);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return {
            color: 'bg-red-50 border-red-200',
            textColor: 'text-red-700',
            text: 'Out of Stock',
            dot: 'bg-red-500'
        };
        if (stock <= 10) return {
            color: 'bg-amber-50 border-amber-200',
            textColor: 'text-amber-700',
            text: 'Low Stock',
            dot: 'bg-amber-500'
        };
        return {
            color: 'bg-emerald-50 border-emerald-200',
            textColor: 'text-emerald-700',
            text: 'In Stock',
            dot: 'bg-emerald-500'
        };
    };

    const ProductCard = ({ product }: { product: TopFishListing }) => {
        const stockStatus = getStockStatus(product.stock);

        return (
            <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
                {/* Header with Featured Badge */}
                {product.isFeatured && (
                    <View className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2">
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="white" />
                            <Text className="text-white text-xs font-semibold ml-1">Featured Product</Text>
                        </View>
                    </View>
                )}

                <View className="p-5">
                    <View className="flex-row">
                        {/* Product Image */}
                        <View className="relative mr-4">
                            <View className="bg-gray-50 w-24 h-24 rounded-xl items-center justify-center border border-gray-100">
                                {product.images.length > 0 ? (
                                    <Image
                                        source={{ uri: product.images[0] }}
                                        className="w-full h-full rounded-xl"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="items-center">
                                        <Ionicons name="fish" size={32} color="#9CA3AF" />
                                    </View>
                                )}
                            </View>

                            {/* Image Count Badge */}
                            {product.images.length > 1 && (
                                <View className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full px-2 py-1 shadow-lg">
                                    <Text className="text-white text-xs font-bold">
                                        +{product.images.length - 1}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Product Details */}
                        <View className="flex-1">
                            {/* Title and Stock Status */}
                            <View className="flex-row justify-between items-start mb-3">
                                <Text className="text-lg font-bold text-gray-900 flex-1 mr-3" numberOfLines={2}>
                                    {product.name}
                                </Text>
                                <View className={`px-3 py-1.5 rounded-full border ${stockStatus.color}`}>
                                    <View className="flex-row items-center">
                                        <View className={`w-2 h-2 rounded-full mr-2 ${stockStatus.dot}`} />
                                        <Text className={`text-xs font-medium ${stockStatus.textColor}`}>
                                            {stockStatus.text}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Description */}
                            <Text className="text-sm text-gray-600 leading-5 mb-4" numberOfLines={2}>
                                {product.description}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <View className="flex-1">
                            {/* Price and Details Grid */}
                            <View className="bg-gray-50 rounded-xl p-3 mb-4">
                                <View className="flex-row justify-between">
                                    <View className="flex-1">
                                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                            Price
                                        </Text>
                                        <Text className="text-xl font-bold text-blue-600">
                                            ₹{product.price.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View className="flex-1 items-center">
                                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                            Stock
                                        </Text>
                                        <Text className="text-lg font-semibold text-gray-900">
                                            {product.stock}
                                        </Text>
                                    </View>
                                    <View className="flex-1 items-end">
                                        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                            Category
                                        </Text>
                                        <View className="bg-blue-50 px-2 py-1 rounded-md">
                                            <Text className="text-xs font-medium text-blue-700">
                                                {product.category}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Stats and Date */}
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-xs text-gray-500">
                                    Listed on: {formatDate(product.createdAt)}
                                </Text>
                                <View className="flex-row justify-end space-x-2 gap-2">
                                    <TouchableOpacity className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                                        <Ionicons name="eye" size={18} color="#6B7280" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                                        <Ionicons name="create-outline" size={18} color="#2563EB" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="bg-red-50 p-2.5 rounded-lg border border-red-200">
                                        <Ionicons name="trash-outline" size={18} color="#DC2626" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white border-b border-gray-100">
                <View className="px-6 pt-4 pb-6">
                    {/* Title and Stats */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-3xl font-bold text-gray-900 mb-1">
                                My Products
                            </Text>
                            <Text className="text-sm text-gray-600">
                                {products?.length || 0} total products
                            </Text>
                        </View>
                        <View className="bg-blue-50 px-4 py-2 rounded-xl">
                            <Text className="text-blue-700 font-semibold text-sm">
                                {filteredProducts?.length || 0} showing
                            </Text>
                        </View>
                    </View>

                    {/* Enhanced Search Bar */}
                    <View className="relative">
                        <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                            <Ionicons name="search" size={20} color="#9CA3AF" />
                        </View>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 text-base"
                            placeholder="Search by product name or category..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                onPress={() => setSearchQuery('')}
                            >
                                <View className="bg-gray-300 rounded-full p-1">
                                    <Ionicons name="close" size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6">
                    {/* Products List */}
                    {currentProducts && currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <View className="bg-white rounded-2xl p-12 items-center border border-gray-100">
                            <View className="bg-gray-50 p-6 rounded-full mb-4">
                                <Ionicons name="fish" size={48} color="#9CA3AF" />
                            </View>
                            <Text className="text-xl font-semibold text-gray-900 mb-2">
                                No products found
                            </Text>
                            <Text className="text-gray-500 text-center leading-6">
                                {searchQuery
                                    ? `No products match "${searchQuery}". Try adjusting your search.`
                                    : "Start by adding your first product to showcase your fish inventory."
                                }
                            </Text>
                        </View>
                    )}

                    {/* Enhanced Pagination */}
                    {totalPages && totalPages > 1 && (
                        <View className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-sm font-medium text-gray-700">
                                    Showing {startIndex + 1}–{Math.min(endIndex, filteredProducts?.length || 0)} of {filteredProducts?.length || 0}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </Text>
                            </View>

                            <View className="flex-row justify-center items-center gap-1.5 space-x-2">
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-xl ${currentPage === 1 ? 'bg-gray-50 border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}
                                    disabled={currentPage === 1}
                                    onPress={() => setCurrentPage(currentPage - 1)}
                                >
                                    <Ionicons
                                        name="chevron-back"
                                        size={18}
                                        color={currentPage === 1 ? "#9CA3AF" : "#2563EB"}
                                    />
                                </TouchableOpacity>

                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={page}
                                            className={`px-4 py-2 rounded-xl min-w-12 items-center ${currentPage === page
                                                ? 'bg-blue-600 border border-blue-600'
                                                : 'bg-gray-50 border border-gray-200'
                                                }`}
                                            onPress={() => setCurrentPage(page)}
                                        >
                                            <Text className={`text-sm font-semibold ${currentPage === page ? 'text-white' : 'text-gray-700'
                                                }`}>
                                                {page}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}

                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-xl ${currentPage === totalPages ? 'bg-gray-50 border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}
                                    disabled={currentPage === totalPages}
                                    onPress={() => setCurrentPage(currentPage + 1)}
                                >
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={currentPage === totalPages ? "#9CA3AF" : "#2563EB"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Enhanced Add Product Button */}
            <View className="px-6 my-1 py-3 bg-white border-t border-gray-100">
                <TouchableOpacity onPress={() => router.push('/add-products')} className="bg-blue-600 py-4 rounded-lg items-center shadow-lg">
                    <View className="flex-row items-center">
                        <Ionicons name="add-circle" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">
                            Add New Product
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ViewProductsScreen;