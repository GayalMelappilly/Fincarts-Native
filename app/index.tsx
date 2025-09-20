import DashboardScreen from '@/components/Home/DashboardScreen';
import { ActivityIndicator, Text } from 'react-native';
import { View } from 'react-native';
import Login from './login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSellerDetails } from '@/services/authServices';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  console.log("Rendering index page")

  // const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [sellerId, setSellerId] = useState<string | null>(null);

  const { isLoggedIn, setIsLoggedIn, setSellerData, sellerData } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-current-seller'],
    queryFn: () => getSellerDetails(sellerId as string),
    enabled: !!sellerId
  });

  useEffect(()=>{
    const getSellerId = async () => {
      const id = await AsyncStorage.getItem('sellerId')
      console.log("ID : ", id)
      if(id){
        console.log("Got id reached here!")
        setSellerId(JSON.parse(id))
      }else{
        console.log("Reached here!")
        setIsLoggedIn(false)
        setSellerId(null)
      }
    }
    getSellerId()
  }, [])

  useEffect(() => {
    if (data) {
      console.log("Res data : ", data);
      if (data.success) {
        setSellerData(data.data);
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }
  }, [data]);

  if (isLoading) return (
    <SafeAreaView className="flex-1 w-full bg-gray-50 justify-center items-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-2 text-gray-600">Loading</Text>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView className="flex-1 w-full bg-gray-50 justify-center items-center">
      <Text className="text-red-600">Error: {(error as Error).message}</Text>
    </SafeAreaView>
  );

  return (
    <View className="items-center flex-1 justify-center">
      {isLoggedIn ? <DashboardScreen /> : <Login />}
      {/* <Login /> */}
      {/* <DashboardScreen /> */}
    </View>
  );
};

// const styles = {
//   container: `items-center flex-1 justify-center`,
// };

export default Home

