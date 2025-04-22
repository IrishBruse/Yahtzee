import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Orange, Red } from "./constants";

export const ScoreCell = ({
  value,
  locked,
  onPress,
}: {
  value?: number;
  locked: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle> | undefined;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.scoreButton, locked ? styles.scoreButtonLocked : {}]}
      disabled={locked}
    >
      <Text style={[styles.scoreText, locked ? styles.scoreTextLocked : {}]}>
        {value ?? "-"}
      </Text>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Orange,
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
