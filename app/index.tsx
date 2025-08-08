import DashboardScreen from '@/components/Home/DashboardScreen';
import { Text } from 'react-native';
import { View } from 'react-native';
import Login from './login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const Home = async () => {
  console.log("Rendering index page")

  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const {isLoggedIn} = useAuth()

  useEffect(()=>{
    setLoggedIn(isLoggedIn)
    console.log("Logged In res : ", isLoggedIn)
  }, [isLoggedIn])

  return (
    <View className="items-center flex-1 justify-center">
      {loggedIn ? <DashboardScreen/> : <Login/>}
      {/* <Login /> */}
    </View>
  );
};

// const styles = {
//   container: `items-center flex-1 justify-center`,
// };

export default Home

