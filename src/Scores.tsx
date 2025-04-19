import { StyleSheet, View } from "react-native";
import { ScoreCell } from "./ScoreCell";

export const Scores = () => {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <ScoreCell label="asd" value="-" />
        <ScoreCell label="asd" value="12" />
      </View>
      <View style={styles.row}>
        <ScoreCell label="asd" value="-" />
        <ScoreCell label="asd" value="12" />
      </View>
      <View style={styles.row}>
        <ScoreCell label="asd" value="-" />
        <ScoreCell label="asd" value="12" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    gap: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
