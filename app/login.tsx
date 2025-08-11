import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    StatusBar
} from 'react-native';
import { Eye, EyeOff, User, Lock, ArrowRight, CheckSquare, Square } from 'lucide-react-native';
import { loginSeller } from '@/services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export interface LoginCredentials {
    identifier: string;
    password: string;
}


export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<boolean>(false);

    const { setIsLoggedIn } = useAuth()

    useEffect(() => {
        const sellerData = async () => {
            const data = await AsyncStorage.getItem('sellerInfo')
            if(data){
                setIsLoggedIn(true)
            }
        }
        sellerData()
    }, [])

    const mutation = useMutation({
        mutationFn: loginSeller,
        onSuccess: async (data) => {
            if (!data.success) {
                setError(true)
            }
            if (data.data.accessToken) {
                console.log("yeah buddy logged in", data.data)
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true)
                await AsyncStorage.setItem('sellerId', JSON.stringify(data.data.id))
                await AsyncStorage.setItem('sellerInfo', JSON.stringify(data.data));
            }
        },
        onError: (err) => {
            console.log('Seller login error : ', err)
        }
    })

    const handleLogin = async () => {
        setIsLoading(true);
        setError(false);
        try {
            mutation.mutate({ identifier, password })
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="#1e40af" />

            {/* Header Section */}
            <View className="bg-blue-600 px-6 py-12 rounded-b-3xl shadow-lg"
            // style={{
            //     background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)'
            // }}
            >
                <View className="max-w-md mx-auto items-center">
                    {/* Logo */}
                    <View className="mb-4">
                        <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-sm">
                            <View className="w-8 h-8 bg-cyan-300 rounded-full items-center justify-center">
                                <Text className="text-blue-800 font-bold text-lg">✓</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-3xl font-bold text-white mb-2 text-center">Seller Dashboard</Text>
                    <Text className="text-blue-100 text-lg text-center">Access your business control center</Text>
                </View>
            </View>

            {/* Login Form Section */}
            <View className="flex-1 px-6 -mt-6">
                <View className="max-w-md mx-auto w-full">
                    <View className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <View className="items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</Text>
                            <Text className="text-gray-600 text-center">Sign in to manage your business</Text>
                        </View>

                        <View className="space-y-6">
                            {/* Email/Phone Field */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Email or Phone Number
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                        <User color="#9ca3af" size={20} />
                                    </View>
                                    <TextInput
                                        value={identifier}
                                        onChangeText={setIdentifier}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800"
                                        placeholder="Enter your email or phone"
                                        placeholderTextColor="#9ca3af"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Password Field */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                                        <Lock color="#9ca3af" size={20} />
                                    </View>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9ca3af"
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                                    >
                                        {showPassword ? (
                                            <EyeOff color="#9ca3af" size={20} />
                                        ) : (
                                            <Eye color="#9ca3af" size={20} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Options Row */}
                            <View className="flex-row items-center justify-between mb-6">
                                <TouchableOpacity
                                    onPress={() => setKeepSignedIn(!keepSignedIn)}
                                    className="flex-row items-center"
                                >
                                    {keepSignedIn ? (
                                        <CheckSquare color="#2563eb" size={16} />
                                    ) : (
                                        <Square color="#6b7280" size={16} />
                                    )}
                                    <Text className="ml-2 text-sm text-gray-600">Keep me signed in</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text className="text-sm text-blue-600 font-medium">
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <View className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                                    <Text className="text-red-600 text-sm">{error}</Text>
                                </View>
                            ) : null}

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-xl flex-row items-center justify-center space-x-2 ${isLoading
                                    ? 'bg-gray-400 opacity-50'
                                    : 'bg-blue-600 active:bg-blue-700'
                                    }`}
                                style={{
                                    backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                                    opacity: isLoading ? 0.5 : 1
                                }}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator color="white" size="small" />
                                        <Text className="text-white font-semibold ml-2">Signing in...</Text>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-semibold mr-2">Access Dashboard</Text>
                                        <ArrowRight color="white" size={20} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Additional Info */}
                        <View className="mt-6 items-center">
                            <View className="flex-row">
                                <Text className="text-gray-500 text-sm">Need help? Contact our </Text>
                                <TouchableOpacity>
                                    <Text className="text-blue-600 font-medium text-sm">support team</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}