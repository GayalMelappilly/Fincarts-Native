import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Footer from '@/components/Footer/Footer';
import { LogOut } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { logoutSeller } from '@/services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, icon }) => (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-gray-100">
        <View className="flex-row items-center mb-4">
            {icon && <View className="mr-3">{icon}</View>}
            <Text className="text-gray-900 font-bold text-xl">{title}</Text>
        </View>
        {children}
    </View>
);

interface ProfileItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value, accent = false }) => (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
        <View className={`w-10 h-10 rounded-xl ${accent ? 'bg-indigo-100' : 'bg-gray-100'} items-center justify-center mr-4`}>
            {icon}
        </View>
        <View className="flex-1">
            <Text className="text-gray-500 text-sm font-medium mb-1">{label}</Text>
            <Text className="text-gray-900 font-semibold text-base">{value}</Text>
        </View>
    </View>
);

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, bgColor }) => (
    <View className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100" style={{ marginHorizontal: 8, minWidth: 140, width: 'auto' }}>
        <View className={`w-12 h-12 rounded-xl ${bgColor} items-center justify-center mb-3`}>
            {icon}
        </View>
        <Text className="text-gray-900 font-bold text-xl mb-1" numberOfLines={1} adjustsFontSizeToFit>
            {value}
        </Text>
        <Text className="text-gray-600 text-sm font-medium" numberOfLines={2}>
            {label}
        </Text>
    </View>
);

interface BusinessStatusBadgeProps {
    status: string;
}

const BusinessStatusBadge: React.FC<BusinessStatusBadgeProps> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
            case 'PENDING':
                return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
            case 'SUSPENDED':
                return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <View className={`flex-row items-center ${config.bg} px-3 py-2 rounded-full`}>
            <View className={`w-2 h-2 rounded-full ${config.dot} mr-2`} />
            <Text className={`${config.text} font-semibold text-sm capitalize`}>{status.toLowerCase()}</Text>
        </View>
    );
};

export default function SellerProfileScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const { setIsLoggedIn, sellerData } = useAuth();

    const formatCurrency = (amount: string | number) => {
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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

    const mutation = useMutation({
        mutationFn: logoutSeller,
        onSuccess: async (data) => {
            if (!data.success) {
                setError(true);
            } else {
                console.log("Logged out");
                await AsyncStorage.setItem('isLoggedIn', 'false');
                setIsLoggedIn(false);
                await AsyncStorage.removeItem('sellerInfo');
                router.push('/');
            }
        },
        onError: (err) => {
            console.log('Seller logout error : ', err);
        }
    });

    const handleLogout = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const sellerInfoString = await AsyncStorage.getItem('sellerInfo');
            const sellerInfo = JSON.parse(sellerInfoString as string);
            mutation.mutate(sellerInfo.refreshToken);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!sellerData) {
        return (
            <SafeAreaView className="flex-1 w-full bg-gray-50 justify-center items-center">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="mt-2 text-gray-600">Loading profile...</Text>
                </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" style={{ width: screenWidth }}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                style={{ width: screenWidth }}
            >
                {/* Enhanced Header with Gradient */}
                <View className="relative" style={{ height: 180, width: screenWidth }}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: screenWidth, height: 180, position: 'absolute' }}
                    />
                    <View className="absolute inset-0 bg-black/20" style={{ width: screenWidth }} />

                    {/* Header Actions */}
                    {/* <View className="absolute flex-row justify-between items-center"
                        style={{ top: 48, left: 16, right: 16, width: screenWidth - 32 }}>
                        <TouchableOpacity className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Feather name="arrow-left" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Feather name="settings" size={22} color="white" />
                        </TouchableOpacity>
                    </View> */}

                    {/* Business Status */}
                    {/* <View className="absolute" style={{ top: 96, right: 16 }}>
                        <BusinessStatusBadge status={sellerData.businessInfo.status} />
                    </View> */}
                </View>

                {/* Enhanced Profile Avatar */}
                <View className="items-center -mt-20 mb-6">
                    <View className="relative">
                        <Image
                            source={{ uri: sellerData.businessInfo.logoUrl }}
                            className="w-36 h-36 rounded-3xl border-6 border-white shadow-2xl"
                        />
                        {/* <View className="absolute -bottom-2 -right-2 bg-indigo-600 w-12 h-12 rounded-2xl items-center justify-center shadow-lg">
                            <Feather name="check" size={20} color="white" />
                        </View> */}
                    </View>
                </View>

                {/* Enhanced Profile Info */}
                <View className="items-center mb-8" style={{ paddingHorizontal: 16, width: screenWidth }}>
                    <Text className="text-3xl font-bold text-gray-900 mb-1">
                        {sellerData.businessInfo.displayName}
                    </Text>
                    <Text className="text-xl text-gray-600 mb-2">
                        {sellerData.businessInfo.businessName}
                    </Text>
                    <Text className="text-center text-gray-500 mb-3 leading-5" style={{ maxWidth: screenWidth - 64 }}>
                        {sellerData.businessInfo.storeDescription}
                    </Text>

                    {/* Rating and Member Info */}
                    <View className="flex-row items-center mb-2">
                        {renderRatingStars(Number(sellerData.metrics.avgRating) || 0)}
                        <Text className="ml-2 text-gray-800 font-semibold">
                            {Number(sellerData.metrics.avgRating) || 0} • {sellerData.metrics.totalOrders} orders
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="calendar-check" size={16} color="#6B7280" />
                        <Text className="ml-2 text-gray-500 font-medium">
                            Member since {formatDate(String(sellerData.createdAt))}
                        </Text>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16, width: screenWidth }}>
                    {/* Enhanced Stats */}
                    {/* Enhanced Stats */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                        style={{ marginBottom: 32, paddingVertical: 12 }}
                    >
                        <StatCard
                            icon={<MaterialCommunityIcons name="currency-inr" size={24} color="#10B981" />}
                            value={formatCurrency(sellerData.metrics.totalSales)}
                            label="Total Sales"
                            color="#10B981"
                            bgColor="bg-emerald-100"
                        />
                        <StatCard
                            icon={<MaterialCommunityIcons name="basket-check" size={20} color="#3B82F6" />}
                            value={sellerData.metrics.totalOrders}
                            label="Total Orders"
                            color="#3B82F6"
                            bgColor="bg-blue-100"
                        />
                        <StatCard
                            icon={<MaterialCommunityIcons name="store" size={24} color="#8B5CF6" />}
                            value={sellerData.metrics.activeListings}
                            label="Active Listings"
                            color="#8B5CF6"
                            bgColor="bg-purple-100"
                        />
                    </ScrollView>


                    {/* Business Information */}
                    <ProfileSection
                        title="Business Information"
                        icon={<MaterialCommunityIcons name="office-building" size={24} color="#4F46E5" />}
                    >
                        <ProfileItem
                            icon={<MaterialCommunityIcons name="domain" size={18} color="#4F46E5" />}
                            label="Legal Business Name"
                            value={sellerData.businessInfo.legalBusinessName}
                            accent
                        />
                        <ProfileItem
                            icon={<MaterialCommunityIcons name="briefcase" size={18} color="#4F46E5" />}
                            label="Business Type"
                            value={sellerData.businessInfo.businessType}
                        />
                        {sellerData.businessInfo.websiteUrl && (
                            <ProfileItem
                                icon={<MaterialCommunityIcons name="web" size={18} color="#4F46E5" />}
                                label="Website"
                                value={sellerData.businessInfo.websiteUrl}
                            />
                        )}
                        {sellerData.businessInfo.gstin && (
                            <ProfileItem
                                icon={<MaterialCommunityIcons name="file-document" size={18} color="#4F46E5" />}
                                label="GSTIN"
                                value={sellerData.businessInfo.gstin}
                            />
                        )}
                    </ProfileSection>

                    {/* Location Information */}
                    <ProfileSection
                        title="Store Location"
                        icon={<MaterialCommunityIcons name="map-marker" size={24} color="#EF4444" />}
                    >
                        <ProfileItem
                            icon={<Feather name="map-pin" size={18} color="#EF4444" />}
                            label="Address"
                            value={sellerData.address.addressLine1}
                            accent
                        />
                        <ProfileItem
                            icon={<MaterialCommunityIcons name="home-city" size={18} color="#EF4444" />}
                            label="Address Type"
                            value={sellerData.address.addressType}
                        />
                    </ProfileSection>

                    {/* Performance Metrics */}
                    <ProfileSection
                        title="Performance Overview"
                        icon={<MaterialCommunityIcons name="chart-line" size={24} color="#10B981" />}
                    >
                        <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-3">
                            <Text className="text-gray-700 font-semibold mb-2">Commission Rate</Text>
                            <Text className="text-2xl font-bold text-indigo-600">
                                {sellerData.commissionRate}%
                            </Text>
                        </View>

                        <View className="flex-row" style={{ justifyContent: 'space-between' }}>
                            <View className="flex-1 bg-green-50 rounded-xl p-4" style={{ marginRight: 8 }}>
                                <MaterialCommunityIcons name="trending-up" size={24} color="#10B981" />
                                <Text className="text-green-700 font-semibold mt-2">Average Rating</Text>
                                <Text className="text-xl font-bold text-green-900">
                                    {Number(sellerData.metrics.avgRating) || 0}/5
                                </Text>
                            </View>

                            <View className="flex-1 bg-purple-50 rounded-xl p-4" style={{ marginLeft: 8 }}>
                                <MaterialCommunityIcons name="package-variant" size={24} color="#8B5CF6" />
                                <Text className="text-purple-700 font-semibold mt-2">Total Listings</Text>
                                <Text className="text-xl font-bold text-purple-900">
                                    {sellerData.metrics.totalListings}
                                </Text>
                            </View>
                        </View>
                    </ProfileSection>

                    {/* Enhanced Action Buttons */}
                    <View className="mt-6 mb-8" style={{ gap: 16 }}>
                        <View className="flex-row" style={{ gap: 12 }}>
                            <TouchableOpacity className="flex-1 bg-blue-600 py-4 rounded-lg flex-row justify-center items-center shadow-lg">
                                <Feather name="edit" size={20} color="white" />
                                <Text className="ml-3 text-white font-bold text-lg">Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogout}
                            disabled={isLoading}
                            className={`bg-red-600 py-4 rounded-lg flex-row justify-center items-center shadow-lg ${isLoading ? 'opacity-50' : ''}`}
                        >
                            <LogOut size={20} color="white" />
                            <Text className="ml-3 text-white font-bold text-lg">
                                {isLoading ? 'Logging out...' : 'Logout'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                            <Text className="text-red-700 font-medium text-center">
                                Logout failed. Please try again.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}