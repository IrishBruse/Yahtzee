import { StyleSheet, View } from "react-native";
import { ScoreCell } from "./ScoreCell";

export const Scores = () => {
  const locked = false;
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <ScoreCell label="Ones" value="-" locked={locked} />
        <ScoreCell label="Three of a Kind" value="12" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Twos" value="-" locked={locked} />
        <ScoreCell label="Four of a Kind" value="12" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Threes" value="-" locked={locked} />
        <ScoreCell label="Small Staight" value="123" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Fours" value="-" locked={locked} />
        <ScoreCell label="Large Staight" value="12" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Fives" value="-" locked={locked} />
        <ScoreCell label="Chance" value="12" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Bonus" value="-" locked />
        <ScoreCell label="Yahtzee" value="12" locked={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Upper Total" value="-" locked />
        <ScoreCell label="Lower Total" value="12" locked />
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
    gap: 20,
  },
});
