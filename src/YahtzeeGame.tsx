import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
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
  numbersToText,
} from "../src/constants";
import { Scores } from "./Scores";

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
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (gameOver) {
      alert(
        `Upper score: ${upperScoreTotal}\nLower score: ${lowerScoreTotal}\n\nTotal score: ${
          upperScoreTotal + lowerScoreTotal
        }`
      );
      restartGame();
      setGameOver(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, upperScoreTotal, lowerScoreTotal]);

  const restartGame = () => {
    console.log("restartGame");
    setRollsLeft(3);
    setDiceValues(Array(NUMBER_OF_DICE).fill(0));
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setLockedScores(Array(NUMBER_OF_SCORES).fill(false));
    setScoreValues(Array(NUMBER_OF_SCORES).fill(0));
    setUpperScoreTotal(0);
    setLowerScoreTotal(0);
    setBonusScore(0);
    nextTurn();
  };

  const handleNewGame = () => {
    console.log("handleNewGame");
    if (window.confirm("Are you sure you want to start a new game?")) {
      restartGame();
    }
  };

  const handleLockScore = async (index: number) => {
    console.log("handleLockScore", index);
    if (rollingDice) {
      return;
    }

    let highestScore = -1;
    for (let i = 0; i < scoreValues.length; i++) {
      if (
        !lockedScores[i] &&
        i !== CHANCE_INDEX &&
        scoreValues[i] > highestScore
      ) {
        highestScore = scoreValues[i];
      }
    }

    if (scoreValues[index] < highestScore) {
      const confirmLock = window.confirm(
        `Are you sure you want ${scoreValues[index]}? There is a higher score available at ${highestScore}.`
      );
      if (!confirmLock) {
        return;
      }
    }

    const newLockedScores = [...lockedScores];
    newLockedScores[index] = true;
    setLockedScores(newLockedScores);

    let newUpperScore = 0;
    let newLowerScore = 0;
    let isGameOver = true;
    const updatedScoreValues = [...scoreValues];

    for (let i = 0; i < updatedScoreValues.length; i++) {
      if (newLockedScores[i]) {
        if (i >= NUMBER_OF_LOWER_SCORES) {
          newLowerScore += updatedScoreValues[i];
        } else {
          newUpperScore += updatedScoreValues[i];
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
    console.log("handleHoldDice", index);
    const newDiceHeld = [...diceHeld];
    newDiceHeld[index] = !newDiceHeld[index];
    setDiceHeld(newDiceHeld);
  };

  const rollDice = async () => {
    if (rollsLeft > 0 && !rollingDice) {
      setRollingDice(true);
      setRollsLeft((prevRollsLeft) => prevRollsLeft - 1);

      // const newDiceValues = [0, 1, 2, 3, 4];
      const newDiceValues = [...diceValues];
      for (let i = 0; i < NUMBER_OF_DICE; i++) {
        if (!diceHeld[i]) {
          // Simulate a delay for animation effect
          await new Promise((resolve) => setTimeout(resolve, 100));
          newDiceValues[i] = Math.floor(Math.random() * 6); // 0 to 5
        }
      }
      setDiceValues(newDiceValues);

      // Simulate animation delay
      setRollingDice(false);
      updateScores(newDiceValues);
    }
  };

  const nextTurn = () => {
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setRollsLeft(3);
    updateScores(diceValues);
    rollDice();
  };

  const updateScores = (currentDiceValues: number[]) => {
    const newScoreValues = [...scoreValues];
    for (let i = 0; i < newScoreValues.length; i++) {
      if (!lockedScores[i]) {
        newScoreValues[i] = 0;
      }
    }

    console.log({ newScoreValues });

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
  };

  const calculateScores = (
    diceFaceCount: number[],
    currentScoreValues: number[],
    totalDiceValue: number
  ) => {
    console.log({ diceFaceCount });

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
  };

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
          onPress={() => {
            alert(
              "Game Info:\nRoll 5 dice up to 3 times per turn.\nScore points by making different combinations.\nLock scores to prevent changes.\nBonus points for upper section total >= 63.\nYahtzee (5 of a kind) scores high!"
            );
          }}
          style={styles.newGameButton}
          disabled={rollingDice || gameOver}
        >
          <Text style={styles.newGameButtonText}>Game Info</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.scoreGridContainer}>
          <Scores
            scoreValues={scoreValues}
            lockedScores={lockedScores}
            handleLockScore={handleLockScore}
            upperTotalScore={upperScoreTotal}
            lowerTotalScore={lowerScoreTotal}
            bonusScore={bonusScore}
          />
        </View>
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
                source={DiceImages[numbersToText[value]]} // Adjust index for 0-based array
                style={styles.diceImage}
                resizeMode="contain"
              />
            </Pressable>
          ))}
        </View>
        <TouchableOpacity
          onPress={rollDice}
          disabled={rollsLeft <= 0 || rollingDice || gameOver}
          style={[
            styles.rollButton,
            rollsLeft <= 0 || rollingDice || gameOver
              ? styles.rollButtonDisabled
              : {},
          ]}
        >
          <Text style={styles.rollButtonText}>
            {rollingDice ? "Rolling..." : `${rollsLeft} Rolls left`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export const styles = StyleSheet.create({
  background: {
    backgroundColor: Orange,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  titleBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  newGameButton: {
    backgroundColor: Red,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  newGameButtonText: {
    color: "#EA8D23",
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
  scoreGridContainer: {
    marginHorizontal: 10,
    marginVertical: 0,
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
    color: "#EA8D23",
    fontSize: 18,
    fontWeight: "bold",
  },
  rollButtonDisabled: {
    backgroundColor: "#888",
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
});
