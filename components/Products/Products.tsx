import React from 'react';
import { View, Text, Pressable, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Footer from '@/components/Footer/Footer';
import { useAuth } from '@/context/AuthContext';

interface MenuCardProps {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
    title,
    description,
    icon,
    onPress
}) => (
    <Pressable
        onPress={onPress}
        className="w-full bg-white rounded-xl p-6 shadow-sm mb-4"
        style={{ elevation: 2 }}
    >
        <View className="flex-row items-center">
            <View className="bg-gray-50 p-3 rounded-lg">
                <Ionicons name={icon} size={24} color="#374151" />
            </View>
            <View className="ml-4 flex-1">
                <Text className="text-gray-800 font-semibold text-base">{title}</Text>
                <Text className="text-gray-500 text-sm mt-1">{description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
    </Pressable>
);

const ProductsScreen = () => {

    const {sellerData} = useAuth()

    return (
        <SafeAreaView className="flex-1 bg-gray-50 w-full">
            <View className="flex-1 px-5 py-8">
                <View className="mb-6">
                    <Text className="text-gray-900 text-2xl font-bold">Your Inventory</Text>
                </View>

                <View className="flex-1">
                    <MenuCard
                        title="My Products"
                        description="View and manage your product catalog"
                        icon="layers-outline"
                        onPress={() => router.push('/view-products')}
                    />

                    <MenuCard
                        title="Add Product"
                        description="Create a new product in your inventory"
                        icon="add-circle-outline"
                        onPress={() => router.push('/add-products')}
                    />

                    <MenuCard
                        title="Edit Product"
                        description="Make changes to existing products"
                        icon="create-outline"
                        onPress={() => router.push('/edit-products')}
                    />

                    <MenuCard
                        title="Delete Product"
                        description="Remove products from your inventory"
                        icon="trash-outline"
                        onPress={() => router.push('/delete-products')}
                    />
                </View>

                <View className="bg-white rounded-xl p-5 shadow-sm" style={{ elevation: 2 }}>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-gray-900">{sellerData?.topFishListings.length}</Text>
                            <Text className="text-gray-500 text-xs">Total Products</Text>
                        </View>
                        <View className="h-full w-px bg-gray-200" />
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-gray-900">{new Set(sellerData?.topFishListings.map(fish => fish.category)).size}</Text>
                            <Text className="text-gray-500 text-xs">Categories</Text>
                        </View>
                        <View className="h-full w-px bg-gray-200" />
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-gray-900 text">{sellerData?.topFishListings.filter(fish => fish.stock < 5).length}</Text>
                            <Text className="text-gray-500 text-xs">Low Stock</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductsScreen;