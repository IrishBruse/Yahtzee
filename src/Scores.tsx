import { StyleSheet, View } from "react-native";
import { ScoreCell } from "./ScoreCell";
import { ScoreNames } from "./constants";

const upperSectionIndices = [0, 1, 2, 3, 4, 5];

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
    <View style={styles.grid}>
      {upperSectionIndices.map((index) => (
        <View style={styles.row} key={`upperRow-${index}`}>
          <ScoreCell
            label={ScoreNames[index]}
            value={scoreValues[index]}
            locked={lockedScores[index]}
            onPress={() => handleLockScore(index)}
            style={styles.smallerCell}
          />
          <ScoreCell
            label={ScoreNames[index + 6]}
            value={scoreValues[index + 6]}
            locked={lockedScores[index + 6]}
            onPress={() => handleLockScore(index + 6)}
          />
        </View>
      ))}
      <View style={styles.row} key="bonusRow">
        <ScoreCell label="Bonus" value={bonusScore} locked />
        <ScoreCell
          label={ScoreNames[12]}
          value={scoreValues[12]}
          locked={lockedScores[12]}
          onPress={() => handleLockScore(12)}
        />
      </View>
      <View style={styles.row} key="totalRow">
        <ScoreCell label="Lower Total" value={lowerTotalScore} locked />
        <ScoreCell label="Upper Total" value={upperTotalScore} locked />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    gap: 10,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  smallerCell: {
    flexGrow: 0.25,
  },
});
