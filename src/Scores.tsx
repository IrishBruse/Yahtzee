import { StyleSheet, Text, View } from "react-native";
import { ScoreCell } from "./ScoreCell";
import { Red, ScoreNames } from "./constants";

const upperSectionIndices = [0, 1, 2, 3, 4, 5];
const lowerSectionIndices = [6, 7, 8, 9, 10, 11, 12];

type ScoresProps = {
  scoreValues: number[];
  lockedScores: boolean[];
  handleLockScore: any;
  bonusScore: number;
  upperTotalScore: number;
  lowerTotalScore: number;
};

export const Scores = ({
  scoreValues,
  lockedScores,
  handleLockScore,
  bonusScore,
  upperTotalScore,
  lowerTotalScore,
}: ScoresProps) => {
  return (
    <View style={styles.grid} key="scores">
      <View style={styles.col}>
        {upperSectionIndices.map((index) => (
          <View style={styles.labelContainer} key={`upperLabel-${index}`}>
            <Text style={styles.label}>{ScoreNames[index]}</Text>
          </View>
        ))}
        <View style={styles.labelContainer} key="upperLabel-bonus">
          <Text style={styles.label}>Bonus</Text>
        </View>
        <View style={styles.labelContainer} key="upperLabel-Totla">
          <Text style={styles.label}>Upper Total</Text>
        </View>
      </View>

      <View style={styles.colCell}>
        {upperSectionIndices.map((index) => (
          <ScoreCell
            value={scoreValues[index]}
            locked={lockedScores[index]}
            onPress={() => handleLockScore(index)}
            key={`upperCell-${index}`}
          />
        ))}
        <ScoreCell value={bonusScore} locked key="upperCell-bonus" />
        <ScoreCell value={upperTotalScore} locked key="upperCell-total" />
      </View>

      <View style={styles.col}>
        {lowerSectionIndices.map((index) => (
          <View style={styles.labelContainer} key={`lowerLabel-${index}`}>
            <Text style={styles.label}>{ScoreNames[index]}</Text>
          </View>
        ))}
        <View style={styles.labelContainer} key="upperLabel-bonus">
          <Text style={styles.label}>Lower Total</Text>
        </View>
      </View>

      <View style={styles.colCell}>
        {lowerSectionIndices.map((index) => (
          <ScoreCell
            value={scoreValues[index]}
            locked={lockedScores[index]}
            onPress={() => handleLockScore(index)}
            key={`lowerCell-${index}`}
          />
        ))}
        <ScoreCell value={lowerTotalScore} locked key="lowerCell-total" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 20,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  col: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  colCell: {
    flex: 1,
    flexGrow: 0.6,
    flexDirection: "column",
    gap: 10,
  },
  labelContainer: {
    minHeight: 50,
    flex: 1,
    justifyContent: "center",
  },
  label: {
    color: Red,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
});
