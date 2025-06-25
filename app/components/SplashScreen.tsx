import React from "react";
import { View, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        width,
        height,
      }}
    >
      <LottieView
        source={require("@/assets/health-animation.json")}
        autoPlay
        loop={false}
        style={{
          width: 200,
          height: 200,
        }}
      />
    </View>
  );
}
