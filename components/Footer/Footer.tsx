import { Text, TouchableOpacity, View } from "react-native"
import { useState } from "react";
import { MaterialIcons, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { router } from "expo-router"
import { useFooterElement } from "@/context/FooterContext";
import { useAuth } from "@/context/AuthContext";

const Footer = () => {
    
    const {activeElement, setActiveElement} = useFooterElement()

    const { isLoggedIn } = useAuth()

    const footerItems = isLoggedIn ? [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: (color:string) => <MaterialIcons name="dashboard" size={24} color={color} />,
            router: '/'
        },
        {
            id: "orders",
            label: "Orders",
            icon: (color:string) => <Feather name="shopping-bag" size={24} color={color} />,
            router: '/orders'
        },
        {
            id: "products",
            label: "Products",
            icon: (color:string) => <Feather name="box" size={24} color={color} />,
            router: '/products'
        },
        {
            id: "profile",
            label: "Profile",
            icon: (color:string) => <Ionicons name="person" size={24} color={color} />,
            router: '/profile'
        }
    ] : [];

    return (
        <View className="flex-row bg-white border-t border-gray-200 py-2">
            {footerItems.map((item) => {
                const isActive = item.id === activeElement;
                const color = isActive ? "#4338ca" : "#666"; 
                return (
                    <TouchableOpacity
                        key={item.id}
                        className="flex-1 items-center py-2"
                        onPress={() => {
                            setActiveElement(item.id);
                            router.push(item.router as any);
                        }}
                    >
                        {item.icon(color)}
                        <Text className={`text-xs mt-1 ${isActive ? "text-indigo-700" : "text-gray-500"}`}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default Footer;
