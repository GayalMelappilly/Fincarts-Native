import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/navigation";
import { Link, router } from "expo-router";
// import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {

    // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'index'>;
    // const navigation = useNavigation<NavigationProp>();

    return (
        <SafeAreaView>
            <View className="px-10">
                <View className="my-10">
                    <Text className="text-4xl font-light">
                        Welcome to FinCart
                    </Text>
                </View>
                <Text className="my-4 text-xl text-center">Choose a signup option</Text>
                <TouchableOpacity
                    className={`flex-row items-center justify-center border bg-white border-gray-200 rounded-lg py-3 px-4 my-2 w-full`}
                    onPress={()=> router.push('/gmail')}
                    activeOpacity={0.8}
                >
                    <Text className={`text-black text-base font-medium`}>Continue with Google</Text>
                    <View className="absolute left-4">
                        <AntDesign name="google" size={24} color="black" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-row items-center justify-center border bg-white border-gray-200 rounded-lg py-3 px-4 my-2 w-full`}
                    // onPress={onPress}
                    activeOpacity={0.8}
                >
                    <Text className={`text-black text-base font-medium`}>Continue with Phone Number</Text>
                    <View className="absolute left-4">
                        <Feather name="phone" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center justify-center border bg-white border-gray-200 rounded-lg py-3 px-4 my-2 w-full`}
                    onPress={() => router.push('/email')}
                    activeOpacity={0.8}
                >
                    <Text className={`text-black text-base font-medium`}>Continue with Email</Text>
                    <View className="absolute left-4">
                        <MaterialIcons name="alternate-email" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SignupScreen