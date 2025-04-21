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
        <ScoreCell label="Three of a Kind" value={12} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[1]}
          value={scoreValues[1]}
          clickable={lockedScores[1]}
          onPress={() => handleLockScore(1)}
        />
        <ScoreCell label="Four of a Kind" value={12} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[2]}
          value={scoreValues[2]}
          clickable={lockedScores[2]}
          onPress={() => handleLockScore(2)}
        />
        <ScoreCell label="Full House" value={123} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[3]}
          value={scoreValues[3]}
          clickable={lockedScores[3]}
          onPress={() => handleLockScore(3)}
        />
        <ScoreCell label="Small Staight" value={123} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[4]}
          value={scoreValues[4]}
          clickable={lockedScores[4]}
          onPress={() => handleLockScore(4)}
        />
        <ScoreCell label="Large Staight" value={12} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell
          label={ScoreNames[5]}
          value={scoreValues[5]}
          clickable={lockedScores[5]}
          onPress={() => handleLockScore(5)}
        />
        <ScoreCell label="Chance" value={12} clickable={locked} />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Bonus" value={bonusScore} clickable />
        <ScoreCell label="Yahtzee" value={0} clickable />
      </View>
      <View style={styles.row}>
        <ScoreCell label="Upper Total" value={upperTotalScore} clickable />
        <ScoreCell label="Lower Total" value={lowerTotalScore} clickable />
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
