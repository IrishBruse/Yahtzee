/** @type {import("expo/config").AppJSONConfig} */
const config = {
  expo: {
    name: "Yahtzee",
    slug: "Yahtzee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.ethanconneely.yahtzee",
    },
    androidStatusBar: {
      backgroundColor: "#EB9B3F",
    },
    androidNavigationBar: {
      visible: "sticky-immersive",
      backgroundColor: "#EB9B3F",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#EB9B3F",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "8d5c7c32-c861-4203-926e-9b16b8cae984",
      },
    },
  },
};

export default config;
