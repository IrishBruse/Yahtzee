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
  LARGE_STRAIGHT_SCORE,
  NUMBER_OF_DICE,
  NUMBER_OF_LOWER_SCORES,
  NUMBER_OF_SCORES,
  Orange,
  Red,
  SMALL_STRAIGHT_INDEX,
  SMALL_STRAIGHT_SCORE,
  THREE_OF_A_KIND_INDEX,
  YAHTZEE_BONUS_SCORE,
  YAHTZEE_INDEX,
  YAHTZEE_SCORE,
  DiceImages,
} from "../src/constants";
import { Scores } from "./Scores";
import { addHighscore, HighscoreItem, loadHighscores } from "./Utility";

export default function YahtzeeGame() {
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [diceHeld, setDiceHeld] = useState<boolean[]>([]);
  const [scoreValues, setScoreValues] = useState<number[]>([]);
  const [lockedScores, setLockedScores] = useState<boolean[]>([]);
  const [rollsLeft, setRollsLeft] = useState<number>(3);
  const [rollingDice, setRollingDice] = useState<boolean>(false);
  const [upperScoreTotal, setUpperScoreTotal] = useState<number>(0);
  const [lowerScoreTotal, setLowerScoreTotal] = useState<number>(0);
  const [bonusScore, setBonusScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [showHighscore, setShowHighscore] = useState<boolean>(false);
  const [highscores, setHighscores] = useState<HighscoreItem[]>([]);

  useEffect(() => {
    restartGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameOver) {
      Alert.alert(
        "Game over",
        `Upper score: ${upperScoreTotal}\nLower score: ${lowerScoreTotal}\n\nTotal score: ${
          upperScoreTotal + lowerScoreTotal
        }`,
        [
          {
            text: "OK",
            onPress: () => {
              addHighscore(upperScoreTotal + lowerScoreTotal);
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
      return newLocked;
    });

    let newUpperScore = 0;
    let newLowerScore = 0;
    let isGameOver = true;

    for (let i = 0; i < scoreValues.length; i++) {
      if (i === index || lockedScores[i]) {
        if (i >= NUMBER_OF_LOWER_SCORES) {
          newLowerScore += scoreValues[i];
        } else {
          newUpperScore += scoreValues[i];
        }
      } else {
        isGameOver = false;
      }
    }

    setUpperScoreTotal(newUpperScore);
    setLowerScoreTotal(newLowerScore);

    const UPPER_SCORE_BONUS_THRESHOLD = 63;
    const BONUS_SCORE = 35;
    if (newUpperScore >= UPPER_SCORE_BONUS_THRESHOLD) {
      setBonusScore(BONUS_SCORE);
    } else {
      setBonusScore(0);
    }

    nextTurn();

    if (isGameOver) {
      setGameOver(true);
    }
  };

  const holdDice = (index: number) => {
    const newDiceHeld = [...diceHeld];
    newDiceHeld[index] = !newDiceHeld[index];
    setDiceHeld(newDiceHeld);
  };

  const calculateScores = useCallback(
    (
      diceFaceCount: number[],
      currentScoreValues: number[],
      totalDiceValue: number
    ) => {
      for (let i = 0; i < diceFaceCount.length; i++) {
        const diceValue = diceFaceCount[i] * (i + 1);

        if (!lockedScores[i]) {
          currentScoreValues[i] = diceValue;
        }
      }

      if (
        !lockedScores[THREE_OF_A_KIND_INDEX] &&
        diceFaceCount.some((count) => count >= 3)
      ) {
        currentScoreValues[THREE_OF_A_KIND_INDEX] = totalDiceValue;
      }

      if (
        !lockedScores[FOUR_OF_A_KIND_INDEX] &&
        diceFaceCount.some((count) => count >= 4)
      ) {
        currentScoreValues[FOUR_OF_A_KIND_INDEX] = totalDiceValue;
      }

      const hasThree = diceFaceCount.some((count) => count === 3);
      const hasTwo = diceFaceCount.some((count) => count === 2);
      if (!lockedScores[FULL_HOUSE_INDEX] && hasThree && hasTwo) {
        currentScoreValues[FULL_HOUSE_INDEX] = FULL_HOUSE_SCORE;
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
          currentScoreValues[SMALL_STRAIGHT_INDEX] = SMALL_STRAIGHT_SCORE;
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
          currentScoreValues[LARGE_STRAIGHT_INDEX] = LARGE_STRAIGHT_SCORE;
        }
      }

      // Chance
      if (!lockedScores[CHANCE_INDEX]) {
        currentScoreValues[CHANCE_INDEX] = totalDiceValue;
      }

      // Yahtzee
      if (
        !lockedScores[YAHTZEE_INDEX] &&
        diceFaceCount.some((count) => count === 5)
      ) {
        if (scoreValues[YAHTZEE_INDEX] >= YAHTZEE_SCORE) {
          if (
            lockedScores[YAHTZEE_INDEX] &&
            scoreValues[YAHTZEE_INDEX] === YAHTZEE_SCORE
          ) {
            currentScoreValues[YAHTZEE_INDEX] += YAHTZEE_BONUS_SCORE;
          }
        } else {
          currentScoreValues[YAHTZEE_INDEX] = YAHTZEE_SCORE;
        }
      }
    },
    [lockedScores, scoreValues]
  );

  const updateScores = useCallback(
    (currentDiceValues: number[]) => {
      const newScoreValues = [...scoreValues];
      for (let i = 0; i < newScoreValues.length; i++) {
        if (!lockedScores[i]) {
          newScoreValues[i] = 0;
        }
      }

      const diceFaceCount = Array(6).fill(0);
      for (const value of currentDiceValues) {
        diceFaceCount[value]++;
      }

      calculateScores(
        diceFaceCount,
        newScoreValues,
        currentDiceValues.reduce((sum, val) => sum + val + 1, 0)
      );
      setScoreValues(newScoreValues);
    },
    [calculateScores, lockedScores, scoreValues]
  );

  const rollDice = useCallback(
    async (held: boolean[]) => {
      if (rollsLeft > 0 && !rollingDice) {
        setRollingDice(true);
        setRollsLeft((prevRollsLeft) => prevRollsLeft - 1);

        let finalDiceValues = [...diceValues];
        for (let i = 0; i < 3; i++) {
          const newDiceValues = [...finalDiceValues];
          for (let j = 0; j < NUMBER_OF_DICE; j++) {
            if (!held[j]) {
              newDiceValues[j] = Math.floor(Math.random() * 6);
            }
          }
          finalDiceValues = newDiceValues;
          setDiceValues(newDiceValues);

          await new Promise((res) => setTimeout(res, 150));
        }

        setRollingDice(false);
        updateScores(finalDiceValues);
      }
    },
    [rollsLeft, rollingDice, diceValues, updateScores]
  );

  const nextTurn = useCallback(() => {
    setRollsLeft(3);
    rollDice(Array(NUMBER_OF_DICE).fill(false));
  }, [rollDice]);

  const restartGame = useCallback(() => {
    setRollsLeft(3);
    setDiceValues(Array(NUMBER_OF_DICE).fill(0));
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setLockedScores(Array(NUMBER_OF_SCORES).fill(false));
    setScoreValues(Array(NUMBER_OF_SCORES).fill(0));
    setUpperScoreTotal(0);
    setLowerScoreTotal(0);
    setBonusScore(0);
    nextTurn();
  }, [nextTurn]);

  return (
    <>
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
          <Text style={styles.newGameButtonText}>Highscores</Text>
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
            <TouchableOpacity
              onPress={() => setShowHighscore(false)}
              style={highscoreStyles.closeButton}
            >
              <Text style={highscoreStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
      <View style={styles.dice}>
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
          onPress={() => rollDice(diceHeld)}
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
    </>
  );
}

export const styles = StyleSheet.create({
  background: {
    backgroundColor: Orange,
    flex: 1,
  },
  titleBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 40,
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
    fontSize: 42,
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
    marginHorizontal: 10,
    marginVertical: 5,
    height: 120,
  },
  diceImage: {
    width: 70,
    height: 70,
  },
  rollButton: {
    backgroundColor: Red,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
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
  diceButtonHeld: {
    transform: [{ translateY: 20 }],
  },
  dice: {
    width: "100%",
    position: "absolute",
    bottom: 0,
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
