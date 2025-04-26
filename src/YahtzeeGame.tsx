import React, { useCallback, useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
  FlatList,
  Platform,
} from "react-native";
import {
  CHANCE_INDEX,
  FOUR_OF_A_KIND_INDEX,
  FULL_HOUSE_INDEX,
  FULL_HOUSE_SCORE,
  LARGE_STRAIGHT_INDEX,
  Orange,
  Red,
  SMALL_STRAIGHT_INDEX,
  SMALL_STRAIGHT_SCORE,
  THREE_OF_A_KIND_INDEX,
  YAHTZEE_INDEX,
  YAHTZEE_SCORE,
  DiceImages,
  LARGE_STRAIGHT_SCORE,
  NUMBER_OF_DICE,
  NUMBER_OF_SCORES,
  NUMBER_OF_DICE_FACES,
  NUMBER_OF_UPPER_SCORES,
} from "../src/constants";
import { Scores } from "./Scores";
import { addHighscore, HighscoreItem, loadHighscores } from "./Utility";

export default function YahtzeeGame() {
  const [diceValues, setDiceValues] = useState<number[]>(
    Array(NUMBER_OF_DICE).fill(0)
  );
  const [diceHeld, setDiceHeld] = useState<boolean[]>(
    Array(NUMBER_OF_DICE).fill(false)
  );
  const [scoreValues, setScoreValues] = useState<number[]>(
    Array(NUMBER_OF_SCORES).fill(0)
  );
  const [lockedScores, setLockedScores] = useState<boolean[]>(
    Array(NUMBER_OF_SCORES).fill(false)
  );

  const [rollsLeft, setRollsLeft] = useState<number>(3);

  const [rollingDice, setRollingDice] = useState<boolean>(false);

  const [upperScoreTotal, setUpperScoreTotal] = useState<number>(0);
  const [lowerScoreTotal, setLowerScoreTotal] = useState<number>(0);
  const [bonusScore, setBonusScore] = useState<number>(0);

  const scoreTotal = upperScoreTotal + lowerScoreTotal + bonusScore;

  const [gameOver, setGameOver] = useState<boolean>(false);

  const [showHighscore, setShowHighscore] = useState<boolean>(false);
  const [highscores, setHighscores] = useState<HighscoreItem[]>([]);

  if (__DEV__) {
    if (!rollingDice) {
      console.log("diceValues", diceValues);
      console.log("diceHeld", diceHeld);
      console.log("scoreValues", scoreValues);
      console.log("lockedScores", lockedScores);
    }
  }

  useEffect(() => {
    restartGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameOver) {
      Alert.alert(
        "Game over",
        `Upper score: ${upperScoreTotal}\nLower score: ${lowerScoreTotal}\n\nTotal score: ${scoreTotal}`,
        [
          {
            text: "OK",
            onPress: () => {
              addHighscore(scoreTotal);
              restartGame();
            },
          },
        ],
        { cancelable: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, upperScoreTotal, lowerScoreTotal]);

  const handleNewGame = () => {
    if (Platform.OS === "web") {
      restartGame();
      return;
    }

    Alert.alert("Are you sure you want to start a new game?", "", [
      { text: "Yes", onPress: restartGame, style: "destructive" },
      { text: "No", style: "cancel" },
    ]);
  };

  const handleLockScore = async (index: number) => {
    if (rollingDice) {
      return;
    }

    setLockedScores((prev) => {
      const newLocked = [...prev];
      newLocked[index] = true;

      console.log(newLocked);

      setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
      setRollsLeft(3);

      let newUpperScore = 0;
      let newLowerScore = 0;
      let isGameOver = true;
      for (let i = 0; i < scoreValues.length; i++) {
        if (i === index || newLocked[i]) {
          if (i >= NUMBER_OF_UPPER_SCORES) {
            newLowerScore += scoreValues[i];
          } else {
            newUpperScore += scoreValues[i];
          }
        } else {
          isGameOver = false;
        }
      }

      const UPPER_SCORE_BONUS_THRESHOLD = 63;
      const BONUS_SCORE = 35;
      if (newUpperScore >= UPPER_SCORE_BONUS_THRESHOLD) {
        setBonusScore(BONUS_SCORE);
      } else {
        setBonusScore(0);
      }

      setUpperScoreTotal(newUpperScore);
      setLowerScoreTotal(newLowerScore);

      if (isGameOver) {
        setGameOver(true);
      }

      setRollingDice(true);

      return newLocked;
    });
  };

  const holdDice = (index: number) => {
    const newDiceHeld = [...diceHeld];
    newDiceHeld[index] = !newDiceHeld[index];
    setDiceHeld(newDiceHeld);
  };

  useEffect(() => {
    if (rollingDice) {
      return;
    }

    const diceFaceCount = Array(NUMBER_OF_DICE_FACES).fill(0);

    for (const element of diceValues) {
      diceFaceCount[element]++;
    }

    const newScores = [...scoreValues];

    const totalDiceValue = diceValues.reduce((acc, curr) => acc + curr + 1, 0);

    // One - Six
    for (let i = 0; i < diceFaceCount.length; i++) {
      const diceValue = diceFaceCount[i] * (i + 1);

      if (!lockedScores[i]) {
        newScores[i] = diceValue;
      }
    }

    // Three of a kind
    if (
      !lockedScores[THREE_OF_A_KIND_INDEX] &&
      diceFaceCount.some((count) => count >= 3)
    ) {
      newScores[THREE_OF_A_KIND_INDEX] = totalDiceValue;
    }

    // Four of a kind
    if (
      !lockedScores[FOUR_OF_A_KIND_INDEX] &&
      diceFaceCount.some((count) => count >= 4)
    ) {
      newScores[FOUR_OF_A_KIND_INDEX] = totalDiceValue;
    }

    // Full House
    const hasThree = diceFaceCount.some((count) => count === 3);
    const hasTwo = diceFaceCount.some((count) => count === 2);
    if (!lockedScores[FULL_HOUSE_INDEX]) {
      if (hasThree && hasTwo) {
        newScores[FULL_HOUSE_INDEX] = FULL_HOUSE_SCORE;
      } else {
        newScores[FULL_HOUSE_INDEX] = 0;
      }
    }

    // Small Straight
    if (!lockedScores[SMALL_STRAIGHT_INDEX]) {
      const hasSmallStraight =
        (diceFaceCount[0] >= 1 &&
          diceFaceCount[1] >= 1 &&
          diceFaceCount[2] >= 1 &&
          diceFaceCount[3] >= 1) ||
        (diceFaceCount[1] >= 1 &&
          diceFaceCount[2] >= 1 &&
          diceFaceCount[3] >= 1 &&
          diceFaceCount[4] >= 1) ||
        (diceFaceCount[2] >= 1 &&
          diceFaceCount[3] >= 1 &&
          diceFaceCount[4] >= 1 &&
          diceFaceCount[5] >= 1);

      if (hasSmallStraight) {
        newScores[SMALL_STRAIGHT_INDEX] = SMALL_STRAIGHT_SCORE;
      } else {
        newScores[SMALL_STRAIGHT_INDEX] = 0;
      }
    }

    // Large Straight
    if (!lockedScores[LARGE_STRAIGHT_INDEX]) {
      const isLargeStraight =
        (diceFaceCount[0] === 1 &&
          diceFaceCount[1] === 1 &&
          diceFaceCount[2] === 1 &&
          diceFaceCount[3] === 1 &&
          diceFaceCount[4] === 1) ||
        (diceFaceCount[1] === 1 &&
          diceFaceCount[2] === 1 &&
          diceFaceCount[3] === 1 &&
          diceFaceCount[4] === 1 &&
          diceFaceCount[5] === 1);
      if (isLargeStraight) {
        newScores[LARGE_STRAIGHT_INDEX] = LARGE_STRAIGHT_SCORE;
      } else {
        newScores[LARGE_STRAIGHT_INDEX] = 0;
      }
    }

    // Chance
    if (!lockedScores[CHANCE_INDEX]) {
      newScores[CHANCE_INDEX] = totalDiceValue;
    }

    // Yahtzee
    if (!lockedScores[YAHTZEE_INDEX]) {
      if (diceFaceCount.some((count) => count === 5)) {
        newScores[YAHTZEE_INDEX] = YAHTZEE_SCORE;
      } else {
        newScores[YAHTZEE_INDEX] = 0;
      }
    }

    setScoreValues([...newScores]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diceValues, rollingDice]);

  useEffect(() => {
    if (!rollingDice) {
      return;
    }

    const newDiceValues = [...diceValues];

    setRollsLeft((prev) => prev - 1);

    const animateDice = async () => {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < NUMBER_OF_DICE; j++) {
          if (!diceHeld[j]) {
            newDiceValues[j] = Math.floor(Math.random() * 6);
          }
        }
        setDiceValues([...newDiceValues]);

        await new Promise((res) => setTimeout(res, 150));
      }
      setRollingDice(false);
    };

    animateDice();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollingDice]);

  const restartGame = useCallback(() => {
    setDiceValues(Array(NUMBER_OF_DICE).fill(0));
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setScoreValues(Array(NUMBER_OF_SCORES).fill(0));
    setLockedScores(Array(NUMBER_OF_SCORES).fill(false));
    setRollsLeft(3);

    setUpperScoreTotal(0);
    setLowerScoreTotal(0);
    setBonusScore(0);
    setGameOver(false);

    setRollingDice(true);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.titleBanner}>
        <TouchableOpacity
          onPress={handleNewGame}
          style={styles.newGameButton}
          disabled={rollingDice || gameOver}
        >
          <Text style={styles.newGameButtonText}>New Game</Text>
        </TouchableOpacity>
        <View style={styles.titleGroup}>
          <Text style={styles.titleText}>Yahtzee</Text>
          <Text style={styles.authorText}>by Ethan</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            setShowHighscore((prev) => !prev);
            setHighscores(await loadHighscores());
          }}
          style={styles.newGameButton}
          disabled={rollingDice || gameOver}
        >
          <Text style={styles.newGameButtonText}>
            {showHighscore ? "    Game    " : "Highscore"}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {showHighscore ? (
          <View style={highscoreStyles.highscoreContainer}>
            <Text style={highscoreStyles.highscoreTitle}>Highscores</Text>
            <FlatList
              style={highscoreStyles.highscoreList}
              data={highscores}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={highscoreStyles.highscoreItem}>
                  <Text style={highscoreStyles.highscoreRank}>
                    {item.rank}.
                  </Text>
                  <Text style={highscoreStyles.highscoreScore}>
                    {item.score}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : (
          <Scores
            scoreValues={scoreValues}
            lockedScores={lockedScores}
            handleLockScore={handleLockScore}
            upperTotalScore={upperScoreTotal}
            lowerTotalScore={lowerScoreTotal}
            bonusScore={bonusScore}
          />
        )}
      </View>
      <View>
        <View style={styles.diceContainer}>
          {diceValues.map((value, index) => (
            <Pressable
              key={index}
              onPress={() => holdDice(index)}
              style={[
                styles.diceButton,
                diceHeld[index] ? styles.diceButtonHeld : {},
              ]}
            >
              <Image
                source={DiceImages[value]}
                style={styles.diceImage}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => setRollingDice(true)}
          disabled={rollsLeft <= 0 || rollingDice || gameOver}
          style={[
            styles.rollButton,
            rollsLeft <= 0 || rollingDice || gameOver
              ? styles.rollButtonDisabled
              : {},
          ]}
        >
          <Text style={styles.rollButtonText}>
            {rollingDice
              ? "Rolling..."
              : `${rollsLeft} Roll${rollsLeft !== 1 ? "s" : ""} left`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  background: {
    backgroundColor: Orange,
  },
  titleBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newGameButton: {
    backgroundColor: Red,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  newGameButtonText: {
    color: Orange,
    fontWeight: "bold",
  },
  titleGroup: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 32,
    color: Red,
    fontWeight: "bold",
    textAlign: "center",
  },
  authorText: {
    fontSize: 12,
    color: Red,
    textAlign: "center",
    marginTop: -5,
  },
  scoreTotalValueCell: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreTotalValueText: {
    color: Red,
    fontWeight: "bold",
    fontSize: 16,
  },
  diceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 25,
  },
  diceImage: {
    width: 67,
    height: 67,
  },
  rollButton: {
    backgroundColor: Red,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  rollButtonText: {
    color: Orange,
    fontSize: 18,
    fontWeight: "bold",
  },
  rollButtonDisabled: {
    opacity: 0.8,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 15,
  },
  grandTotalLabel: {
    color: Red,
    fontWeight: "bold",
    fontSize: 16,
  },
  grandTotalValue: {
    color: Red,
    fontWeight: "bold",
    fontSize: 16,
  },
  diceButton: {
    transitionProperty: "transform",
    transitionDuration: "150ms",
    transitionTimingFunction: "ease-out",
  },
  screenContainer: {
    display: "flex",
    padding: 15,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  diceButtonHeld: {
    transform: [{ translateY: 20 }],
  },
});

const highscoreStyles = StyleSheet.create({
  highscoreList: {
    width: "100%",
  },
  highscoreContainer: {
    backgroundColor: Orange,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: "auto",
    marginTop: 20,
    alignItems: "center",
    width: "60%",
  },
  highscoreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Red,
    marginBottom: 15,
  },
  highscoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Red,
  },
  highscoreRank: {
    fontSize: 18,
    color: Red,
    fontWeight: "bold",
    marginRight: 10,
  },
  highscoreScore: {
    fontSize: 18,
    color: Red,
  },
  closeButton: {
    backgroundColor: Red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: Orange,
    fontWeight: "bold",
    fontSize: 16,
  },
});
