import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageRequireSource,
} from "react-native";

const numbersToText = ["one", "two", "three", "four", "five", "six"];

const diceImages: Record<string, ImageRequireSource> = {
  one: require("../../assets/dice/dice_one.png"),
  two: require("../../assets/dice/dice_two.png"),
  three: require("../../assets/dice/dice_three.png"),
  four: require("../../assets/dice/dice_four.png"),
  five: require("../../assets/dice/dice_five.png"),
  six: require("../../assets/dice/dice_six.png"),
};

const NUMBER_OF_DICE = 5;
const NUMBER_OF_DICE_FACES = 6;
const NUMBER_OF_SCORES = 13;
const NUMBER_OF_LOWER_SCORES = 6;

const THREE_OF_A_KIND_INDEX = 6;
const FOUR_OF_A_KIND_INDEX = 7;
const FULL_HOUSE_INDEX = 8;
const SMALL_STRAIGHT_INDEX = 9;
const LARGE_STRAIGHT_INDEX = 10;
const CHANCE_INDEX = 11;
const YAHTZEE_INDEX = 12;

interface ScoreNameToIndex {
  Ones: number;
  Twos: number;
  Threes: number;
  Fours: number;
  Fives: number;
  Sixes: number;
  "Three of a kind": number;
  "Four of a kind": number;
  "Full House": number;
  "Small Straight": number;
  "Large Straight": number;
  Chance: number;
  Yahtzee: number;
}

const scoreNameToIndex: ScoreNameToIndex = {
  Ones: 0,
  Twos: 1,
  Threes: 2,
  Fours: 3,
  Fives: 4,
  Sixes: 5,
  "Three of a kind": 6,
  "Four of a kind": 7,
  "Full House": 8,
  "Small Straight": 9,
  "Large Straight": 10,
  Chance: 11,
  Yahtzee: 12,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EB9B3F",
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
    backgroundColor: "#CA2222",
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
    color: "#CA2222",
    fontWeight: "bold",
    textAlign: "center",
  },
  authorText: {
    fontSize: 12,
    color: "#CA2222",
    textAlign: "center",
    marginTop: -5,
  },
  scoreGridContainer: {
    marginHorizontal: 10,
    marginVertical: 0,
  },
  scoreGridRow: {
    flexDirection: "row",
  },
  scoreCell: {
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  scoreLabelCell: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  scoreLabelText: {
    color: "#CA2222",
    fontWeight: "bold",
    fontSize: 14,
  },
  scoreValueCell: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  scoreTotalValueCell: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreTotalValueText: {
    color: "#CA2222",
    fontWeight: "bold",
    fontSize: 16,
  },
  scoreButton: {
    backgroundColor: "#CA2222",
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  scoreButtonAvailable: {},
  scoreButtonPotential: {
    borderColor: "#FFFF00",
    borderWidth: 1,
  },
  scoreButtonLocked: {
    backgroundColor: "transparent",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreTextAvailable: {
    color: "#EA8D23",
  },
  scoreTextLocked: {
    color: "#CA2222",
  },
  diceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 80,
  },
  diceButton: {},
  diceHeld: {
    opacity: 0.6,
  },
  diceImage: {
    width: 50,
    height: 50,
  },
  rollButton: {
    backgroundColor: "#CA2222",
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
    color: "#CA2222",
    fontWeight: "bold",
    fontSize: 16,
  },
  grandTotalValue: {
    color: "#CA2222",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default function HomeScreen() {
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

  const delay = useCallback(
    (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    []
  );

  const calculateScores = useCallback(
    (
      currentDiceValues: number[],
      currentLockedScores: boolean[],
      currentScoreValues: number[]
    ): number[] => {
      const newScores = [...currentScoreValues];
      const diceFaceCount = Array(NUMBER_OF_DICE_FACES).fill(0);
      let totalDiceValue = 0;

      currentDiceValues.forEach((value) => {
        diceFaceCount[value]++;
        totalDiceValue += value + 1;
      });

      for (let i = 0; i < NUMBER_OF_SCORES; i++) {
        if (!currentLockedScores[i]) {
          newScores[i] = 0;
        }
      }

      for (let i = 0; i < NUMBER_OF_LOWER_SCORES; i++) {
        if (!currentLockedScores[i]) {
          newScores[i] = diceFaceCount[i] * (i + 1);
        }
      }

      let has3 = false;
      let has4 = false;
      let hasYahtzee = false;
      let isFullHouse = false;
      const counts = Object.values(diceFaceCount);

      for (let i = 0; i < NUMBER_OF_DICE_FACES; i++) {
        if (diceFaceCount[i] >= 3) has3 = true;
        if (diceFaceCount[i] >= 4) has4 = true;
        if (diceFaceCount[i] >= 5) hasYahtzee = true;
      }
      if (counts.includes(3) && counts.includes(2)) {
        isFullHouse = true;
      } else if (hasYahtzee && counts.includes(5)) {
        if (
          currentLockedScores[FULL_HOUSE_INDEX] &&
          currentLockedScores[YAHTZEE_INDEX]
        ) {
          isFullHouse = counts.includes(3) && counts.includes(2);
        } else {
          isFullHouse = counts.includes(3) && counts.includes(2);
        }
      }

      if (has3 && !currentLockedScores[THREE_OF_A_KIND_INDEX]) {
        newScores[THREE_OF_A_KIND_INDEX] = totalDiceValue;
      }
      if (has4 && !currentLockedScores[FOUR_OF_A_KIND_INDEX]) {
        newScores[FOUR_OF_A_KIND_INDEX] = totalDiceValue;
      }
      const FULL_HOUSE_SCORE = 25;
      if (isFullHouse && !currentLockedScores[FULL_HOUSE_INDEX]) {
        newScores[FULL_HOUSE_INDEX] = FULL_HOUSE_SCORE;
      }

      const SMALL_STRAIGHT_SCORE = 30;
      if (!currentLockedScores[SMALL_STRAIGHT_INDEX]) {
        for (let i = 0; i <= 2; i++) {
          if (
            diceFaceCount[i] >= 1 &&
            diceFaceCount[i + 1] >= 1 &&
            diceFaceCount[i + 2] >= 1 &&
            diceFaceCount[i + 3] >= 1
          ) {
            newScores[SMALL_STRAIGHT_INDEX] = SMALL_STRAIGHT_SCORE;
            break;
          }
        }
      }

      const LARGE_STRAIGHT_SCORE = 40;
      if (!currentLockedScores[LARGE_STRAIGHT_INDEX]) {
        for (let i = 0; i <= 1; i++) {
          if (
            diceFaceCount[i] >= 1 &&
            diceFaceCount[i + 1] >= 1 &&
            diceFaceCount[i + 2] >= 1 &&
            diceFaceCount[i + 3] >= 1 &&
            diceFaceCount[i + 4] >= 1
          ) {
            newScores[LARGE_STRAIGHT_INDEX] = LARGE_STRAIGHT_SCORE;
            break;
          }
        }
      }

      if (!currentLockedScores[CHANCE_INDEX]) {
        newScores[CHANCE_INDEX] = totalDiceValue;
      }

      const YAHTZEE_SCORE = 50;
      if (hasYahtzee) {
        if (currentLockedScores[YAHTZEE_INDEX]) {
          if (currentScoreValues[YAHTZEE_INDEX] > 0) {
            if (!currentLockedScores[YAHTZEE_INDEX]) {
              newScores[YAHTZEE_INDEX] = YAHTZEE_SCORE;
            }
          }
        } else {
          newScores[YAHTZEE_INDEX] = YAHTZEE_SCORE;
        }
      }

      return newScores;
    },
    []
  );

  const updateScores = useCallback(
    (
      currentDiceValues: number[],
      currentLockedScores: boolean[],
      currentScoreValues: number[]
    ) => {
      const newPotentialScores = calculateScores(
        currentDiceValues,
        currentLockedScores,
        currentScoreValues
      );
      setScoreValues(newPotentialScores);
    },
    [calculateScores]
  );

  const rollDice = useCallback(async () => {
    if (rollsLeft <= 0 || rollingDice) return;

    setRollingDice(true);
    const currentRoll = rollsLeft - 1;
    setRollsLeft(currentRoll);

    const newDiceValues = [...diceValues];

    const ROLL_ANIMATION_COUNT = 4;
    const ANIMATION_FRAME_DELAY = 25;
    const ANIMATION_SET_DELAY = 50;

    for (let i = 0; i < ROLL_ANIMATION_COUNT; i++) {
      const animationValues = [...newDiceValues];
      for (let j = 0; j < NUMBER_OF_DICE; j++) {
        if (!diceHeld[j]) {
          animationValues[j] = Math.floor(Math.random() * NUMBER_OF_DICE_FACES);
        }
      }
      setDiceValues(animationValues);
      await delay(ANIMATION_FRAME_DELAY * NUMBER_OF_DICE);
      await delay(ANIMATION_SET_DELAY);
    }

    const finalValues = [...diceValues];
    for (let j = 0; j < NUMBER_OF_DICE; j++) {
      if (!diceHeld[j]) {
        finalValues[j] = Math.floor(Math.random() * NUMBER_OF_DICE_FACES);
      }
    }
    setDiceValues(finalValues);

    updateScores(finalValues, lockedScores, scoreValues);

    setRollingDice(false);
  }, [
    rollsLeft,
    rollingDice,
    diceValues,
    diceHeld,
    lockedScores,
    scoreValues,
    updateScores,
    delay,
  ]);

  const nextTurn = useCallback(() => {
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setRollsLeft(3);
    setTimeout(() => {
      rollDice();
    }, 0);
  }, [rollDice]);

  const restartGame = useCallback(() => {
    setDiceValues(Array(NUMBER_OF_DICE).fill(0));
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setScoreValues(Array(NUMBER_OF_SCORES).fill(0));
    setLockedScores(Array(NUMBER_OF_SCORES).fill(false));
    setUpperScoreTotal(0);
    setLowerScoreTotal(0);
    setBonusScore(0);
    setGameOver(false);
    setRollsLeft(3);
    setTimeout(() => {
      rollDice();
    }, 0);
  }, [rollDice]);

  useEffect(() => {
    restartGame();
  }, [restartGame]);

  const handleHoldDice = useCallback(
    (index: number) => {
      if (rollingDice || rollsLeft === 3) return;
      const newHeld = [...diceHeld];
      newHeld[index] = !newHeld[index];
      setDiceHeld(newHeld);
    },
    [diceHeld, rollingDice, rollsLeft, setDiceHeld]
  );

  const handleLockScore = useCallback(
    (index: number) => {
      if (rollingDice || lockedScores[index] || rollsLeft === 3) {
        return;
      }

      const scoreToLock = scoreValues[index];

      let actualScoreToLock = scoreToLock;
      let yahtzeeBonusEarned = 0;
      const YAHTZEE_SCORE = 50;
      const YAHTZEE_BONUS_SCORE = 100;

      const diceFaceCount = Array(NUMBER_OF_DICE_FACES).fill(0);
      diceValues.forEach((value) => {
        diceFaceCount[value]++;
      });
      const isCurrentRollYahtzee = diceFaceCount.some((count) => count >= 5);

      if (
        isCurrentRollYahtzee &&
        lockedScores[YAHTZEE_INDEX] &&
        scoreValues[YAHTZEE_INDEX] >= YAHTZEE_SCORE
      ) {
        if (index === YAHTZEE_INDEX) {
          yahtzeeBonusEarned = YAHTZEE_BONUS_SCORE;
          console.log("Yahtzee Bonus Earned!");
          if (index < NUMBER_OF_LOWER_SCORES) {
            actualScoreToLock = diceFaceCount[index] * (index + 1);
          } else if (
            index === THREE_OF_A_KIND_INDEX ||
            index === FOUR_OF_A_KIND_INDEX ||
            index === CHANCE_INDEX
          ) {
            actualScoreToLock = diceValues.reduce(
              (sum, val) => sum + val + 1,
              0
            );
          } else if (
            index === FULL_HOUSE_INDEX ||
            index === SMALL_STRAIGHT_INDEX ||
            index === LARGE_STRAIGHT_INDEX
          ) {
            actualScoreToLock = scoreValues[index];
          } else {
            actualScoreToLock = scoreValues[index];
          }
        } else {
          actualScoreToLock = scoreValues[index];
        }
      } else if (index === YAHTZEE_INDEX && isCurrentRollYahtzee) {
        actualScoreToLock = YAHTZEE_SCORE;
      } else {
        actualScoreToLock = scoreValues[index];
      }

      const newLockedScores = [...lockedScores];
      newLockedScores[index] = true;
      setLockedScores(newLockedScores);

      const newFinalScores = [...scoreValues];
      newFinalScores[index] = actualScoreToLock;
      setScoreValues(newFinalScores);

      let currentUpperTotal = 0;
      let currentLowerTotal = 0;
      let gamesOverCheck = true;
      const BONUS_THRESHOLD = 63;
      const BONUS_VALUE = 35;
      let currentBonus = 0;

      for (let i = 0; i < NUMBER_OF_SCORES; i++) {
        if (newLockedScores[i]) {
          if (i < NUMBER_OF_LOWER_SCORES) {
            currentUpperTotal += newFinalScores[i];
          } else {
            currentLowerTotal += newFinalScores[i];
          }
        } else {
          gamesOverCheck = false;
        }
      }

      currentLowerTotal += yahtzeeBonusEarned;

      if (currentUpperTotal >= BONUS_THRESHOLD) {
        currentBonus = BONUS_VALUE;
      }

      setUpperScoreTotal(currentUpperTotal);
      setLowerScoreTotal(currentLowerTotal);
      setBonusScore(currentBonus);
      setGameOver(gamesOverCheck);

      if (gamesOverCheck) {
        const finalTotalScore =
          currentUpperTotal + currentLowerTotal + currentBonus;
        Alert.alert(
          "Game Over!",
          `Upper Score: ${currentUpperTotal}\nBonus: ${currentBonus}\nLower Score: ${currentLowerTotal}\n\nTotal Score: ${finalTotalScore}`,
          [{ text: "New Game", onPress: restartGame }]
        );
      } else {
        nextTurn();
      }
    },
    [
      rollingDice,
      lockedScores,
      rollsLeft,
      scoreValues,
      diceValues,
      nextTurn,
      restartGame,
      setLockedScores,
      setScoreValues,
      setUpperScoreTotal,
      setLowerScoreTotal,
      setBonusScore,
      setGameOver,
    ]
  );

  const handleNewGame = useCallback(() => {
    Alert.alert("New Game", "Are you sure you want to start a new game?", [
      { text: "Cancel", style: "cancel" },
      { text: "New Game", onPress: restartGame },
    ]);
  }, [restartGame]);

  const renderScoreCell = useCallback(
    (index: number) => {
      const isLocked = lockedScores[index];
      const potentialValue = scoreValues[index];
      const displayValue = isLocked
        ? potentialValue
        : rollsLeft < 3
        ? potentialValue
        : "-";
      const canInteract = !isLocked && !rollingDice && rollsLeft < 3;

      return (
        <TouchableOpacity
          onPress={() => handleLockScore(index)}
          style={[
            styles.scoreButton,
            isLocked ? styles.scoreButtonLocked : styles.scoreButtonAvailable,
            !isLocked && (potentialValue > 0 || rollsLeft < 3) && !gameOver
              ? styles.scoreButtonPotential
              : {},
          ]}
          disabled={!canInteract || gameOver}
        >
          <Text
            style={[
              styles.scoreText,
              isLocked ? styles.scoreTextLocked : styles.scoreTextAvailable,
            ]}
          >
            {displayValue}
          </Text>
        </TouchableOpacity>
      );
    },
    [
      lockedScores,
      scoreValues,
      rollsLeft,
      rollingDice,
      gameOver,
      handleLockScore,
    ]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        style="light"
        backgroundColor={styles.safeArea.backgroundColor}
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.titleBanner}>
          <TouchableOpacity
            onPress={handleNewGame}
            style={styles.newGameButton}
            disabled={rollingDice}
          >
            <Text style={styles.newGameButtonText}>New Game</Text>
          </TouchableOpacity>
          <View style={styles.titleGroup}>
            <Text style={styles.titleText}>Yahtzee</Text>
            <Text style={styles.authorText}>by Ethan</Text>
          </View>
          <View
            style={{ width: styles.newGameButton.paddingHorizontal * 2 + 70 }}
          />
        </View>

        <View style={styles.scoreGridContainer}>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Ones</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Ones"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Three of a kind</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Three of a kind"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Twos</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Twos"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Four of a kind</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Four of a kind"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Threes</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Threes"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Full House</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Full House"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Fours</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Fours"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Small Straight</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Small Straight"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Fives</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Fives"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Large Straight</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Large Straight"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Sixes</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Sixes"])}
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Chance</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Chance"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Bonus</Text>
            </View>
            <View style={styles.scoreTotalValueCell}>
              <Text style={styles.scoreTotalValueText}>{bonusScore}</Text>
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Yahtzee</Text>
            </View>
            <View style={styles.scoreValueCell}>
              {renderScoreCell(scoreNameToIndex["Yahtzee"])}
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Upper Total</Text>
            </View>
            <View style={styles.scoreTotalValueCell}>
              <Text style={styles.scoreTotalValueText}>{upperScoreTotal}</Text>
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Lower Total</Text>
            </View>
            <View style={styles.scoreTotalValueCell}>
              <Text style={styles.scoreTotalValueText}>{lowerScoreTotal}</Text>
            </View>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>
              {upperScoreTotal + lowerScoreTotal + bonusScore}
            </Text>
          </View>
        </View>

        <View style={styles.diceContainer}>
          {diceValues.map((value, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleHoldDice(index)}
              style={[
                styles.diceButton,
                diceHeld[index] ? styles.diceHeld : {},
                { backgroundColor: "transparent" },
              ]}
              disabled={rollingDice || rollsLeft === 3 || gameOver}
            >
              <Image
                source={diceImages[numbersToText[value]]}
                style={styles.diceImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
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
            {rollingDice ? "Rolling..." : `Roll (${rollsLeft})`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
