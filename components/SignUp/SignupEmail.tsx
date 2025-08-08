import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputFieldProps = {
    label: string;
    placeholder: string;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: (text: string) => void;
};

const InputField = ({ label, placeholder, secureTextEntry = false, value, onChangeText }: InputFieldProps) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
        <TextInput
            className="bg-blue-50 rounded-lg p-3 text-base text-gray-800"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#a0aec0"
        />
    </View>
);

const SignupEmail = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        // Handle signup logic here
        console.log('Signing up with:', { firstName, lastName, email });
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10 w-full px-12">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                {/* Main Content */}
                <View className="p-5">
                    <Text>Welcome to FinCart</Text>
                    <Text className="text-2xl font-bold text-gray-900 mb-6">Create your account</Text>

                    <InputField
                        label="First name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <InputField
                        label="Last name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <InputField
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <InputField
                        label="Confirm password"
                        placeholder="Confirm your password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <TouchableOpacity
                        className="bg-cyan-500 rounded-lg py-3.5 items-center mt-2"
                        onPress={handleSignup}
                    >
                        <Text className="text-white text-base font-semibold">Sign up</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="p-6 border-t border-gray-200 items-center">
                    <View className="flex-row justify-center mb-4">
                        <Text className="text-gray-500 text-sm mx-3">About us</Text>
                        <Text className="text-gray-500 text-sm mx-3">Community</Text>
                        <Text className="text-gray-500 text-sm mx-3">Blog</Text>
                    </View>
                    <View className="flex-row justify-center mb-4">
                        <Text className="text-gray-500 text-sm mx-3">Help center</Text>
                        <Text className="text-gray-500 text-sm mx-3">Privacy</Text>
                        <Text className="text-gray-500 text-sm mx-3">Terms</Text>
                    </View>

                    <View className="flex-row justify-center my-4">
                        <Ionicons name="logo-facebook" size={20} color="#718096" className="mx-3" />
                        <Ionicons name="logo-twitter" size={20} color="#718096" className="mx-3" />
                        <Ionicons name="logo-instagram" size={20} color="#718096" className="mx-3" />
                    </View>

                    <Text className="text-gray-400 text-xs mt-2">2023 Aquarium Finder</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupEmail;