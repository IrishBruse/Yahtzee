import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Orange, Red } from "./constants";

export const ScoreCell = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("press");
        }}
        style={styles.scoreButton}
        disabled={false}
      >
        <Text style={styles.scoreText}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    width: "75%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  scoreButtonPotential: {
    borderColor: "#FFFF00",
    borderWidth: 1,
  },
  scoreButtonLocked: {
    backgroundColor: "transparent",
  },
});
