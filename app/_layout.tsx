import { StyleSheet, StatusBar } from "react-native";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EB9B3F",
    flex: 1,
  },
  statusbar: {
    backgroundColor: "#EB9B3F",
  },
});

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={styles.statusbar.backgroundColor} />
      <Slot />
    </SafeAreaView>
  );
}
