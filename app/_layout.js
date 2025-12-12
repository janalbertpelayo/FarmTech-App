import { Stack } from "expo-router";
import { ProductProvider } from "../context/productcontext";

export default function Layout() {
  return (
    <ProductProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
        <Stack.Screen name="welcome" />
        <Stack.Screen name="index" />
        <Stack.Screen name="products" />
        <Stack.Screen name="logistics" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="community" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="marketplace" />
        <Stack.Screen name="cart" />
      </Stack>
    </ProductProvider>
  );
}