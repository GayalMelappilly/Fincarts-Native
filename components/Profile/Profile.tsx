import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { sellerProfile } from '@/datasets/profileData';
import Footer from '@/components/Footer/Footer';

const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <Text className="text-gray-800 font-bold text-lg mb-3">{title}</Text>
        {children}
    </View>
);

const ProfileItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
    icon, label, value
}) => (
    <View className="flex-row items-center my-4 last:mb-0">
        <View className="w-8">{icon}</View>
        <View className="flex-1 ml-2">
            <Text className="text-gray-500 text-xs">{label}</Text>
            <Text className="text-gray-800 font-medium">{value}</Text>
        </View>
    </View>
);

const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({
    icon, value, label
}) => (
    <View className="bg-white rounded-lg p-3 flex-1 mx-1 shadow-sm items-center">
        <View className="mb-2">{icon}</View>
        <Text className="text-gray-800 font-bold text-lg">{value}</Text>
        <Text className="text-gray-500 text-xs text-center">{label}</Text>
    </View>
);

export default function SellerProfileScreen() {

    const renderRatingStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : i - 0.5 <= rating ? "star-half" : "star-outline"}
                    size={16}
                    color="#FFB237"
                />
            );
        }
        return <View className="flex-row">{stars}</View>;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 w-full">
            <ScrollView className="pb-8">
                {/* Header with Cover Image */}
                <View className="relative h-48">
                    <Image
                        source={{ uri: sellerProfile.coverImage }}
                        className="w-full h-full absolute"
                    />
                    <View className="absolute inset-0 bg-black opacity-30" />
                    <View className="absolute top-8 left-4 right-4 flex-row justify-end items-center">
                        <TouchableOpacity className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                            <Feather name="edit-2" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profile Avatar */}
                <View className="items-center -mt-16 mb-4">
                    <Image
                        source={{ uri: sellerProfile.avatar }}
                        className="w-32 h-32 rounded-full border-4 border-white"
                    />
                </View>

                {/* Profile Info */}
                    <View className="items-center mb-6">
                        <Text className="text-2xl font-bold text-gray-800">{sellerProfile.name}</Text>
                        <Text className="text-lg text-gray-600">{sellerProfile.businessName}</Text>
                        <View className="flex-row items-center mt-1">
                            {renderRatingStars(sellerProfile.stats.averageRating)}
                            <Text className="ml-1 text-gray-800 font-medium">
                                {sellerProfile.stats.averageRating} ({sellerProfile.stats.totalReviews} reviews)
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-1">
                            <MaterialCommunityIcons name="clock-time-four-outline" size={14} color="#6B7280" />
                            <Text className="ml-1 text-gray-500">Member since {sellerProfile.memberSince}</Text>
                        </View>
                    </View>

                <View className='px-3'> 
                    {/* Stats */}
                    <View className="flex-row justify-center mb-6">
                        <StatCard
                            icon={<MaterialCommunityIcons name="basket-check" size={24} color="#4F46E5" />}
                            value={sellerProfile.stats.totalSales.toString()}
                            label="Total Sales"
                        />
                        <StatCard
                            icon={<Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />}
                            value={sellerProfile.stats.completedOrders.toString()}
                            label="Completed Orders"
                        />
                        <StatCard
                            icon={<MaterialCommunityIcons name="timer-sand" size={24} color="#F59E0B" />}
                            value={sellerProfile.stats.pendingOrders.toString()}
                            label="Pending Orders"
                        />
                    </View>

                    {/* Bio */}
                    <ProfileSection title="About">
                        <Text className="text-gray-700 leading-5">{sellerProfile.bio}</Text>
                    </ProfileSection>

                    {/* Contact Info */}
                    <ProfileSection title="Contact Information">
                        <ProfileItem
                            icon={<Feather name="mail" size={18} color="#4F46E5" />}
                            label="Email"
                            value={sellerProfile.email}
                        />
                        <ProfileItem
                            icon={<Feather name="phone" size={18} color="#4F46E5" />}
                            label="Phone"
                            value={sellerProfile.phone}
                        />
                        <ProfileItem
                            icon={<Feather name="map-pin" size={18} color="#4F46E5" />}
                            label="Address"
                            value={sellerProfile.address}
                        />
                    </ProfileSection>

                    {/* Action Buttons */}
                    <View className="flex-row mt-2 mb-8">
                        <TouchableOpacity className="flex-1 bg-indigo-600 py-3 rounded-lg mx-1 flex-row justify-center items-center">
                            <Feather name="edit" size={18} color="white" />
                            <Text className="ml-2 text-white font-medium">Edit Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white border border-gray-300 py-3 rounded-lg mx-1 flex-row justify-center items-center">
                            <Feather name="eye" size={18} color="#4F46E5" />
                            <Text className="ml-2 text-indigo-600 font-medium">View Store</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}