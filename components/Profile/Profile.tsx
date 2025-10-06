import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    Feather,
    MaterialCommunityIcons,
    Ionicons,
    AntDesign,
    FontAwesome5,
} from '@expo/vector-icons';
import Footer from '@/components/Footer/Footer';
import { LogOut, Edit3, Save, X, Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatCard } from './StatCard';
import { EditableField } from './EditableFields';
import { ProfileSection } from './ProfileSection';

const { width: screenWidth } = Dimensions.get('window');

export default function ModernSellerProfileScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { setIsLoggedIn, sellerData, setSellerData } = useAuth();

    // Editable form state
    const [editFormData, setEditFormData] = useState({
        displayName: sellerData?.businessInfo.displayName || '',
        businessName: sellerData?.businessInfo.businessName || '',
        legalBusinessName: sellerData?.businessInfo.legalBusinessName || '',
        storeDescription: sellerData?.businessInfo.storeDescription || '',
        websiteUrl: sellerData?.businessInfo.websiteUrl || '',
        gstin: sellerData?.businessInfo.gstin || '',
        email: sellerData?.contactInfo.email || '',
        phone: sellerData?.contactInfo.phone || '',
        alternatePhone: sellerData?.contactInfo.alternatePhone || '',
        addressLine1: sellerData?.address.addressLine1 || '',
        addressLine2: sellerData?.address.addressLine2 || '',
        landmark: sellerData?.address.landmark || '',
    });

    const scrollViewRef = useRef<ScrollView>(null);

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

    const handleEditToggle = () => {
        if (isEditMode) {
            // Cancel edit - show confirmation
            Alert.alert(
                'Discard Changes',
                'Are you sure you want to discard your changes?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            setIsEditMode(false);
                            // Reset form data
                            setEditFormData({
                                displayName: sellerData?.businessInfo.displayName || '',
                                businessName: sellerData?.businessInfo.businessName || '',
                                legalBusinessName: sellerData?.businessInfo.legalBusinessName || '',
                                storeDescription: sellerData?.businessInfo.storeDescription || '',
                                websiteUrl: sellerData?.businessInfo.websiteUrl || '',
                                gstin: sellerData?.businessInfo.gstin || '',
                                email: sellerData?.contactInfo.email || '',
                                phone: sellerData?.contactInfo.phone || '',
                                alternatePhone: sellerData?.contactInfo.alternatePhone || '',
                                addressLine1: sellerData?.address.addressLine1 || '',
                                addressLine2: sellerData?.address.addressLine2 || '',
                                landmark: sellerData?.address.landmark || '',
                            });
                        },
                    },
                ]
            );
        } else {
            setIsEditMode(true);
            // Scroll to top when entering edit mode
            setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 100);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Validate required fields
            if (!editFormData.displayName.trim() || !editFormData.businessName.trim() || !editFormData.email.trim()) {
                Alert.alert('Validation Error', 'Please fill in all required fields.');
                return;
            }

            // TODO: API call to update profile
            console.log('Saving profile changes:', editFormData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update local data (you should replace this with actual API response)
            if (sellerData) {
                const updatedSellerData = {
                    ...sellerData,
                    businessInfo: {
                        ...sellerData.businessInfo,
                        displayName: editFormData.displayName,
                        businessName: editFormData.businessName,
                        legalBusinessName: editFormData.legalBusinessName,
                        storeDescription: editFormData.storeDescription,
                        websiteUrl: editFormData.websiteUrl,
                        gstin: editFormData.gstin,
                    },
                    contactInfo: {
                        ...sellerData.contactInfo,
                        email: editFormData.email,
                        phone: editFormData.phone,
                        alternatePhone: editFormData.alternatePhone,
                    },
                    address: {
                        ...sellerData.address,
                        addressLine1: editFormData.addressLine1,
                        addressLine2: editFormData.addressLine2,
                        landmark: editFormData.landmark,
                    },
                };
                setSellerData(updatedSellerData);
            }

            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditMode(false);
        } catch (err: any) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
            console.error('Save error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await AsyncStorage.clear();
                            setIsLoggedIn(false);
                            setSellerData(null);
                            router.push('/');
                        } catch (err: any) {
                            setError('Failed to logout');
                            console.error('Logout error:', err);
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    // const handleQuickAction = (action: string) => {
    //     switch (action) {
    //         case 'products':
    //             // Navigate to products
    //             console.log('Navigate to products');
    //             break;
    //         case 'orders':
    //             // Navigate to orders
    //             console.log('Navigate to orders');
    //             break;
    //         case 'analytics':
    //             // Navigate to analytics
    //             console.log('Navigate to analytics');
    //             break;
    //         case 'support':
    //             // Navigate to support
    //             console.log('Navigate to support');
    //             break;
    //         default:
    //             break;
    //     }
    // };

    if (!sellerData) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600 font-medium">Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Enhanced Header with Gradient */}
                    <View className="relative mb-20" style={{ height: 250 }}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ width: screenWidth, height: 250, position: 'absolute' }}
                        />
                        <View className="absolute inset-0 bg-black/10" />

                        {/* Business Status Badge */}
                        <View className="absolute top-12 right-4">
                            <View className=" px-4 py-3">
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity
                                        onPress={handleEditToggle}
                                        disabled={isSaving}
                                        className={`flex-row items-center px-4 py-2 rounded-xl ${isEditMode
                                            ? 'bg-red-50 border border-red-200'
                                            : 'bg-blue-50 border border-blue-200'
                                            } ${isSaving ? 'opacity-50' : ''}`}
                                    >
                                        {isEditMode ? (
                                            <X size={18} color="#DC2626" />
                                        ) : (
                                            <Edit3 size={18} color="#2563EB" />
                                        )}
                                        <Text className={`ml-2 font-semibold ${isEditMode ? 'text-red-700' : 'text-blue-700'
                                            }`}>
                                            {isEditMode ? 'Cancel' : 'Edit'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Profile Avatar */}
                        <View className="absolute -bottom-16 left-0 right-0 items-center">
                            <View className="relative">
                                <Image
                                    source={{ uri: sellerData.businessInfo.logoUrl }}
                                    className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl"
                                />
                                {isEditMode && (
                                    <TouchableOpacity className="absolute -bottom-2 -right-2 bg-blue-600 w-10 h-10 rounded-2xl items-center justify-center shadow-lg">
                                        <Camera size={18} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                    </View>

                    <View className="px-4">
                        {/* Profile Info Section */}
                        <View className="mb-6">
                            {isEditMode ? (
                                <ProfileSection
                                    title="Basic Information"
                                    icon={<MaterialCommunityIcons name="account-edit" size={24} color="#3B82F6" />}
                                    accent
                                >
                                    <EditableField
                                        label="Display Name*"
                                        value={editFormData.displayName}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, displayName: text }))}
                                        placeholder="Enter display name"
                                        maxLength={50}
                                    />
                                    <EditableField
                                        label="Business Name*"
                                        value={editFormData.businessName}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, businessName: text }))}
                                        placeholder="Enter business name"
                                        maxLength={100}
                                    />
                                    <EditableField
                                        label="Legal Business Name"
                                        value={editFormData.legalBusinessName}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, legalBusinessName: text }))}
                                        placeholder="Enter legal business name"
                                        maxLength={100}
                                    />
                                    <EditableField
                                        label="Store Description"
                                        value={editFormData.storeDescription}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, storeDescription: text }))}
                                        placeholder="Describe your business..."
                                        multiline
                                        maxLength={500}
                                    />
                                    <EditableField
                                        label="Website URL"
                                        value={editFormData.websiteUrl}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, websiteUrl: text }))}
                                        placeholder="https://your-website.com"
                                        keyboardType="default"
                                    />
                                    <EditableField
                                        label="GSTIN"
                                        value={editFormData.gstin}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, gstin: text }))}
                                        placeholder="Enter GSTIN number"
                                        maxLength={15}
                                    />
                                </ProfileSection>
                            ) : (
                                <>
                                    <View className="mb-6 items-center left-0 right-0">
                                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                                            {sellerData.businessInfo.displayName}
                                        </Text>
                                        {/* <Text className="text-xl text-gray-600 mb-3">
                                            {sellerData.businessInfo.businessName}
                                        </Text> */}
                                        <Text className="text-gray-500 leading-6 mb-4">
                                            {sellerData.businessInfo.storeDescription}
                                        </Text>

                                        {/* Rating and Member Info */}
                                        <View className="flex-row items-center mb-3">
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
                                </>
                            )}
                        </View>

                        {/* Performance Stats */}
                        {!isEditMode && (
                            <View className="mb-6">
                                <Text className="text-lg font-bold text-gray-900 mb-4 px-2">Performance Overview</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 8 }}
                                >
                                    <StatCard
                                        icon={<MaterialCommunityIcons name="currency-inr" size={24} color="#059669" />}
                                        value={formatCurrency(sellerData.metrics.totalSales)}
                                        label="Total Sales"
                                        color="#059669"
                                        bgColor="bg-emerald-100"
                                        trend={{ value: 12, isPositive: true }}
                                    />
                                    <StatCard
                                        icon={<MaterialCommunityIcons name="basket-check" size={24} color="#2563EB" />}
                                        value={sellerData.metrics.totalOrders}
                                        label="Total Orders"
                                        color="#2563EB"
                                        bgColor="bg-blue-100"
                                        trend={{ value: 8, isPositive: true }}
                                    />
                                    <StatCard
                                        icon={<MaterialCommunityIcons name="store" size={24} color="#7C3AED" />}
                                        value={sellerData.metrics.activeListings}
                                        label="Active Listings"
                                        color="#7C3AED"
                                        bgColor="bg-violet-100"
                                    />
                                    <StatCard
                                        icon={<MaterialCommunityIcons name="star" size={24} color="#F59E0B" />}
                                        value={`${Number(sellerData.metrics.avgRating) || 0}/5`}
                                        label="Average Rating"
                                        color="#F59E0B"
                                        bgColor="bg-amber-100"
                                    />
                                </ScrollView>
                            </View>
                        )}

                        {/* Contact Information */}
                        <ProfileSection
                            title="Contact Information"
                            icon={<MaterialCommunityIcons name="phone" size={24} color="#059669" />}
                        >
                            {isEditMode ? (
                                <>
                                    <EditableField
                                        label="Email Address*"
                                        value={editFormData.email}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, email: text }))}
                                        placeholder="Enter email address"
                                        keyboardType="email-address"
                                    />
                                    <EditableField
                                        label="Primary Phone*"
                                        value={editFormData.phone}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, phone: text }))}
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                    />
                                    <EditableField
                                        label="Alternate Phone"
                                        value={editFormData.alternatePhone}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, alternatePhone: text }))}
                                        placeholder="Enter alternate phone number"
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                    />
                                </>
                            ) : (
                                <>
                                    <View className="flex-row items-center py-3 border-b border-gray-100">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="email" size={18} color="#059669" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Email</Text>
                                            <Text className="text-gray-900 font-semibold">{sellerData.contactInfo.email}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center py-3 border-b border-gray-100">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="phone" size={18} color="#059669" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Primary Phone</Text>
                                            <Text className="text-gray-900 font-semibold">{sellerData.contactInfo.phone}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center py-3">
                                        <View className="w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="phone-plus" size={18} color="#059669" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Alternate Phone</Text>
                                            <Text className="text-gray-900 font-semibold">
                                                {sellerData.contactInfo.alternatePhone || 'Not provided'}
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            )}
                        </ProfileSection>

                        {/* Location Information */}
                        <ProfileSection
                            title="Business Location"
                            icon={<MaterialCommunityIcons name="map-marker" size={24} color="#DC2626" />}
                        >
                            {isEditMode ? (
                                <>
                                    <EditableField
                                        label="Address Line 1*"
                                        value={editFormData.addressLine1}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, addressLine1: text }))}
                                        placeholder="Enter primary address"
                                    />
                                    <EditableField
                                        label="Address Line 2"
                                        value={editFormData.addressLine2}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, addressLine2: text }))}
                                        placeholder="Enter secondary address (optional)"
                                    />
                                    <EditableField
                                        label="Landmark"
                                        value={editFormData.landmark}
                                        onChangeText={(text) => setEditFormData(prev => ({ ...prev, landmark: text }))}
                                        placeholder="Enter nearby landmark"
                                    />
                                </>
                            ) : (
                                <>
                                    <View className="flex-row items-center py-3 border-b border-gray-100">
                                        <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="map-marker" size={18} color="#DC2626" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Primary Address</Text>
                                            <Text className="text-gray-900 font-semibold">{sellerData.address.addressLine1}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center py-3">
                                        <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="home-city" size={18} color="#DC2626" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Address Type</Text>
                                            <Text className="text-gray-900 font-semibold capitalize">
                                                {sellerData.address.addressType.toLowerCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            )}
                        </ProfileSection>

                        {/* Business Information - Only show in view mode */}
                        {!isEditMode && (
                            <ProfileSection
                                title="Business Details"
                                icon={<MaterialCommunityIcons name="office-building" size={24} color="#7C3AED" />}
                            >
                                <View className="flex-row items-center py-3 border-b border-gray-100">
                                    <View className="w-10 h-10 rounded-xl bg-violet-100 items-center justify-center mr-4">
                                        <MaterialCommunityIcons name="domain" size={18} color="#7C3AED" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-sm font-medium mb-1">Legal Business Name</Text>
                                        <Text className="text-gray-900 font-semibold">{sellerData.businessInfo.legalBusinessName}</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center py-3 border-b border-gray-100">
                                    <View className="w-10 h-10 rounded-xl bg-violet-100 items-center justify-center mr-4">
                                        <MaterialCommunityIcons name="briefcase" size={18} color="#7C3AED" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-sm font-medium mb-1">Business Type</Text>
                                        <Text className="text-gray-900 font-semibold">{sellerData.businessInfo.businessType}</Text>
                                    </View>
                                </View>
                                {sellerData.businessInfo.websiteUrl && (
                                    <View className="flex-row items-center py-3 border-b border-gray-100">
                                        <View className="w-10 h-10 rounded-xl bg-violet-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="web" size={18} color="#7C3AED" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">Website</Text>
                                            <Text className="text-gray-900 font-semibold">{sellerData.businessInfo.websiteUrl}</Text>
                                        </View>
                                    </View>
                                )}
                                {sellerData.businessInfo.gstin && (
                                    <View className="flex-row items-center py-3">
                                        <View className="w-10 h-10 rounded-xl bg-violet-100 items-center justify-center mr-4">
                                            <MaterialCommunityIcons name="file-document" size={18} color="#7C3AED" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-sm font-medium mb-1">GSTIN</Text>
                                            <Text className="text-gray-900 font-semibold">{sellerData.businessInfo.gstin}</Text>
                                        </View>
                                    </View>
                                )}
                                <View className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 mt-4">
                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-violet-700 font-semibold mb-1">Commission Rate</Text>
                                            <Text className="text-2xl font-bold text-violet-900">
                                                {sellerData.commissionRate}%
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name="percent" size={32} color="#7C3AED" />
                                    </View>
                                </View>
                            </ProfileSection>
                        )}

                        {/* Top Performing Products - Only show in view mode */}
                        {!isEditMode && sellerData.topFishListings.length > 0 && (
                            <ProfileSection
                                title="Top Performing Products"
                                icon={<MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />}
                            >
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row" style={{ gap: 16 }}>
                                        {sellerData.topFishListings.slice(0, 5).map((product, index) => (
                                            <View
                                                key={product.id}
                                                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                                                style={{ width: 160 }}
                                            >
                                                <Image
                                                    source={{ uri: product.images[0] }}
                                                    className="w-full h-20 rounded-xl mb-3"
                                                    resizeMode="cover"
                                                />
                                                <Text className="text-gray-900 font-bold text-sm mb-1" numberOfLines={2}>
                                                    {product.name}
                                                </Text>
                                                <Text className="text-amber-600 font-bold text-lg mb-1">
                                                    ₹{product.price}
                                                </Text>
                                                <View className="flex-row items-center justify-between">
                                                    <Text className="text-gray-500 text-xs">Stock: {product.stock}</Text>
                                                    <View className="bg-amber-100 px-2 py-1 rounded-full">
                                                        <Text className="text-amber-700 font-semibold text-xs">#{index + 1}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </ProfileSection>
                        )}

                        {/* Action Buttons */}
                        <View className="mt-6 mb-8">
                            {!isEditMode && (
                                <TouchableOpacity
                                    onPress={handleLogout}
                                    disabled={isLoading}
                                    className={`bg-red-600 py-4 rounded-2xl flex-row justify-center items-center shadow-lg ${isLoading ? 'opacity-50' : ''
                                        }`}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <LogOut size={20} color="white" />
                                    )}
                                    <Text className="ml-3 text-white font-bold text-lg">
                                        {isLoading ? 'Logging out...' : 'Logout'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Error Display */}
                        {error && (
                            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="alert-circle" size={20} color="#DC2626" />
                                    <Text className="text-red-700 font-medium ml-2 flex-1">
                                        {error}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Security Notice - Only show in edit mode */}
                        {/* {isEditMode && (
                            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                                <View className="flex-row items-start">
                                    <MaterialCommunityIcons name="information" size={20} color="#2563EB" />
                                    <View className="ml-3 flex-1">
                                        <Text className="text-blue-900 font-semibold mb-1">Security Notice</Text>
                                        <Text className="text-blue-700 text-sm leading-5">
                                            Changes to sensitive information like email and phone numbers may require verification.
                                            You'll receive a confirmation message after saving.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )} */}
                    </View>
                </ScrollView>

                {/* Floating Save Button for Edit Mode */}
                {isEditMode && (
                    <View className="absolute bottom-6 left-4 right-4">
                        <TouchableOpacity
                            onPress={handleSaveChanges}
                            disabled={isSaving}
                            className={`bg-blue-600 py-4 rounded-2xl flex-row justify-center items-center shadow-2xl ${isSaving ? 'opacity-50' : ''
                                }`}
                            style={{
                                shadowColor: '#2563EB',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 16,
                                elevation: 12,
                            }}
                        >
                            {isSaving ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Save size={20} color="white" />
                            )}
                            <Text className="ml-3 text-white font-bold text-lg">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}