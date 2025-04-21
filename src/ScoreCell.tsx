import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Orange, Red } from "./constants";

export const ScoreCell = ({
  label,
  value,
  locked,
  onPress,
  style,
}: {
  label: string;
  value?: number;
  locked: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle> | undefined;
}) => {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.scoreButton, locked ? styles.scoreButtonLocked : {}]}
        disabled={false}
      >
        <Text style={[styles.scoreText, locked ? styles.scoreTextLocked : {}]}>
          {value ?? "-"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: Red,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    paddingRight: 6,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Orange,
  },
  scoreTextAvailable: {
    color: "#EA8D23",
  },
  scoreTextLocked: {
    color: Red,
  },
  scoreButton: {
    backgroundColor: Red,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 50,
  },
  scoreButtonLocked: {
    backgroundColor: "transparent",
  },
});
