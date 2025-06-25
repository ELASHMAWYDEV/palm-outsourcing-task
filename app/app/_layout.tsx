import { StatusBar } from "expo-status-bar";
import HealthCheckIn from "../components/HealthCheckIn";
import SplashScreen from "../components/SplashScreen";
import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "@/tamagui.config";
import { useFontLoader } from "../components/FontLoader";
import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PortalProvider } from "@tamagui/portal";
import { queryClient } from "../api";

export default function RootLayout() {
  const fontsLoaded = useFontLoader();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <PortalProvider shouldAddRootHost>
          <StatusBar style="auto" />
          {(!fontsLoaded || showSplash) && <SplashScreen />}
          {fontsLoaded && !showSplash && <HealthCheckIn />}
        </PortalProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
