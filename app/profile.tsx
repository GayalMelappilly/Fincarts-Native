import ProfileScreen from '@/components/Profile/Profile';
import { View } from 'react-native';

const Profile = () => {
  return (
    <View className={styles.container}>
      <ProfileScreen />
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center`,
};

export default Profile