import { StyleSheet, View } from "react-native";
import { ScoreCell } from "./ScoreCell";
import { ScoreNames } from "./constants";

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
  const locked = false;
  for (let i = 0; i < ScoreNames.length; i++) {
    console.log(ScoreNames[i] + ":", scoreValues[i]);
  }

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[0]}
          value={scoreValues[0]}
          clickable={lockedScores[0]}
          onPress={() => handleLockScore(0)}
        />
        <ScoreCell
          label={ScoreNames[6]}
          value={scoreValues[6]}
          clickable={lockedScores[6]}
          onPress={() => handleLockScore(6)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[1]}
          value={scoreValues[1]}
          clickable={lockedScores[1]}
          onPress={() => handleLockScore(1)}
        />
        <ScoreCell
          label={ScoreNames[7]}
          value={scoreValues[7]}
          clickable={lockedScores[7]}
          onPress={() => handleLockScore(7)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[2]}
          value={scoreValues[2]}
          clickable={lockedScores[2]}
          onPress={() => handleLockScore(2)}
        />
        <ScoreCell
          label={ScoreNames[8]}
          value={scoreValues[8]}
          clickable={lockedScores[8]}
          onPress={() => handleLockScore(8)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[3]}
          value={scoreValues[3]}
          clickable={lockedScores[3]}
          onPress={() => handleLockScore(3)}
        />
        <ScoreCell
          label={ScoreNames[9]}
          value={scoreValues[9]}
          clickable={lockedScores[9]}
          onPress={() => handleLockScore(9)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[4]}
          value={scoreValues[4]}
          clickable={lockedScores[4]}
          onPress={() => handleLockScore(4)}
        />
        <ScoreCell
          label={ScoreNames[10]}
          value={scoreValues[10]}
          clickable={lockedScores[10]}
          onPress={() => handleLockScore(10)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[5]}
          value={scoreValues[5]}
          clickable={lockedScores[5]}
          onPress={() => handleLockScore(5)}
        />
        <ScoreCell
          label={ScoreNames[11]}
          value={scoreValues[11]}
          clickable={lockedScores[11]}
          onPress={() => handleLockScore(11)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Bonus" value={bonusScore} clickable />
        <ScoreCell
          label={ScoreNames[12]}
          value={scoreValues[12]}
          clickable={lockedScores[12]}
          onPress={() => handleLockScore(12)}
        />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Lower Total" value={lowerTotalScore} clickable />
        <ScoreCell label="Upper Total" value={upperTotalScore} clickable />
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
