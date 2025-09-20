import { SplashScreen, Stack, useSegments } from "expo-router";
import '@/global.css'
import { useEffect } from "react";
import { FooterElementProvider, useFooterElement } from "@/context/FooterContext";
import Footer from "@/components/Footer/Footer";
import { StatusBar, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const queryClient = new QueryClient();

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  const FooterUpdater = () => {
    const segments = useSegments()
    const { setActiveElement } = useFooterElement()

    useEffect(() => {
      const currentRoute = segments.toString()
      const match = currentRoute.match(/\(([^)]+)\)/)
      const parentRoute = match ? match ? match[1] : "" : currentRoute
      if (parentRoute == "") {
        setActiveElement('dashboard')
      } else {
        setActiveElement(parentRoute.toString())
      }
    }, [segments])
    return null
  }

  return (
    <FooterElementProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar barStyle="default" />
          <Toast />
          <FooterUpdater />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ title: 'Signup' }} />
              <Stack.Screen name="(signupWith)/email" options={{ title: 'Continue with email' }} />
              <Stack.Screen name="(signupWith)/gmail" options={{ title: 'Continue with Google' }} />
              <Stack.Screen name="(products)/addProducts" options={{ title: 'Add Product' }} />
              <Stack.Screen name="products" options={{ title: 'Products' }} />
              <Stack.Screen name="orders" options={{ title: 'Orders' }} />
              <Stack.Screen name="profile" options={{ title: 'Profile' }} />
            </Stack>
            <Footer />
        </AuthProvider>
      </QueryClientProvider>
    </FooterElementProvider>
  );
}