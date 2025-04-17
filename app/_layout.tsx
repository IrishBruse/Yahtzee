import { View, StyleSheet, StatusBar } from "react-native";
import { Slot } from "expo-router";

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
    <View style={styles.container}>
      <StatusBar backgroundColor={styles.statusbar.backgroundColor} />
      <Slot />
    </View>
  );
}
