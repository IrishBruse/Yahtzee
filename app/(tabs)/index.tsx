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
const NUMBER_OF_DICE_FACES = 6; // Faces are 1-6, indices 0-5
const NUMBER_OF_SCORES = 13;
const NUMBER_OF_LOWER_SCORES = 6; // The first 6 scores (Aces to Sixes) are the upper section

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

const FULL_HOUSE_SCORE = 25;
const SMALL_STRAIGHT_SCORE = 30;
const LARGE_STRAIGHT_SCORE = 40;
const YAHTZEE_SCORE = 50;
const YAHTZEE_BONUS_SCORE = 100;
const BONUS_THRESHOLD = 63;
const BONUS_VALUE = 35;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#EB9B3F",
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
    opacity: 0.6, // Visual cue for held dice
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

const RenderScoreCell = ({
  index,
  rollsLeft,
  rollingDice,
  gameOver,
  lockedScores,
  scoreValues,
  handleLockScore,
}: {
  index: number;
  rollsLeft: number;
  rollingDice: boolean;
  gameOver: boolean;
  lockedScores: boolean[];
  scoreValues: number[];
  handleLockScore: (index: number) => Promise<void>; // Updated signature
}) => {
  const isLocked = lockedScores[index];
  const potentialValue = scoreValues[index];
  const displayValue = isLocked
    ? potentialValue
    : // Display '-' before the first roll (rollsLeft is 3)
    // or if there's no potential score and it's not locked after rolling
    rollsLeft === 3 && !isLocked
    ? "-"
    : potentialValue;

  // Can interact if not locked, not rolling, after the first roll (rollsLeft < 3), and game not over
  const canInteract = !isLocked && !rollingDice && rollsLeft < 3 && !gameOver;

  return (
    <TouchableOpacity
      onPress={() => handleLockScore(index)}
      style={[
        styles.scoreButton,
        isLocked ? styles.scoreButtonLocked : styles.scoreButtonAvailable,
        // Apply potential style if not locked, not rolling, after first roll, and value is non-zero (or index is Yahtzee bonus eligible)
        canInteract && (potentialValue > 0 || index === YAHTZEE_INDEX)
          ? styles.scoreButtonPotential
          : {},
      ]}
      disabled={!canInteract}
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
};

export default function HomeScreen() {
  const [diceValues, setDiceValues] = useState<number[]>(
    Array(NUMBER_OF_DICE).fill(0) // 0-5 represents 1-6
  );
  const [diceHeld, setDiceHeld] = useState<boolean[]>(
    Array(NUMBER_OF_DICE).fill(false)
  );
  const [scoreValues, setScoreValues] = useState<number[]>(
    Array(NUMBER_OF_SCORES).fill(0)
  ); // Potential/Final scores
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

  // Effect to roll dice on initial load (similar to OnAppearing)
  useEffect(() => {
    // Use a timeout to ensure the UI is ready before the first roll animation
    setTimeout(() => {
      rollDice();
    }, 100); // Short delay
  }, []); // Empty dependency array means this runs once on mount

  const calculateScores = useCallback(
    (
      currentDiceValues: number[],
      currentLockedScores: boolean[],
      currentScoreValues: number[]
    ): number[] => {
      // Only calculate scores for unlocked categories
      const newScores = [...currentScoreValues];

      const diceFaceCount = Array(NUMBER_OF_DICE_FACES).fill(0);
      let totalDiceValue = 0;

      // Note: diceValues are 0-5, representing 1-6
      currentDiceValues.forEach((value) => {
        // value is 0-5, dice face is value + 1
        diceFaceCount[value]++;
        totalDiceValue += value + 1; // Sum of actual face values
      });

      // Reset potential scores (for unlocked categories)
      for (let i = 0; i < NUMBER_OF_SCORES; i++) {
        if (!currentLockedScores[i]) {
          newScores[i] = 0;
        }
      }

      // Upper Section (Aces to Sixes)
      for (let i = 0; i < NUMBER_OF_LOWER_SCORES; i++) {
        if (!currentLockedScores[i]) {
          newScores[i] = diceFaceCount[i] * (i + 1); // Sum of dice with face value i+1
        }
      }

      // Lower Section
      let has3 = false;
      let has4 = false;
      let hasYahtzee = false;

      for (let i = 0; i < NUMBER_OF_DICE_FACES; i++) {
        if (diceFaceCount[i] >= 3) has3 = true;
        if (diceFaceCount[i] >= 4) has4 = true;
        if (diceFaceCount[i] >= 5) hasYahtzee = true;
      }

      // Three of a Kind
      if (has3 && !currentLockedScores[THREE_OF_A_KIND_INDEX]) {
        newScores[THREE_OF_A_KIND_INDEX] = totalDiceValue;
      }

      // Four of a Kind
      if (has4 && !currentLockedScores[FOUR_OF_A_KIND_INDEX]) {
        newScores[FOUR_OF_A_KIND_INDEX] = totalDiceValue;
      }

      // Full House (Check for exactly 3 of one and exactly 2 of another)
      const counts = Object.values(diceFaceCount);
      const isFullHouse = counts.includes(3) && counts.includes(2);

      if (isFullHouse && !currentLockedScores[FULL_HOUSE_INDEX]) {
        newScores[FULL_HOUSE_INDEX] = FULL_HOUSE_SCORE;
      }
      // Note: C# code has extra logic for Yahtzee counting as Full House if locked,
      // Standard Yahtzee rules allow a Yahtzee to score as a Full House.
      // Let's stick to the simpler and standard check: counts.includes(3) && counts.includes(2)
      // A Yahtzee (5 of a kind) has counts like [0,0,0,0,0,5] or [5,0,0,0,0,0].
      // Object.values([5,0,0,0,0,0]) -> [5,0,0,0,0,0]. includes(3) is false, includes(2) is false.
      // So the check counts.includes(3) && counts.includes(2) correctly evaluates to false for Yahtzee.
      // This means a Yahtzee CANNOT automatically score as a Full House with this rule.
      // Yahtzee rules vary. Let's assume the C# logic is the desired behavior:
      // A Yahtzee counts as a Full House IF you have a 3 of one number and 2 of another.
      // This interpretation is a bit non-standard. Let's revert to the C# check.
      // C# Logic: if (counts.includes(3) && counts.includes(2)) { isFullHouse = true; }
      // else if (hasYahtzee && counts.includes(5)) { isFullHouse = counts.includes(3) && counts.includes(2); }
      // The 'else if' part seems redundant if counts.includes(5) is true, then includes(3) && includes(2) will be false.
      // A more common rule is: if 5 of a kind, it can score as Full House. Let's use that.
      const isFiveOfAKind = counts.includes(5);
      const isStandardFullHouse = counts.includes(3) && counts.includes(2);

      if (
        (isStandardFullHouse || isFiveOfAKind) &&
        !currentLockedScores[FULL_HOUSE_INDEX]
      ) {
        newScores[FULL_HOUSE_INDEX] = FULL_HOUSE_SCORE;
      }

      // Small Straight (Sequence of 4 dice values)
      // Check for 1-2-3-4, 2-3-4-5, or 3-4-5-6
      // Need to check if diceFaceCount has at least 1 of each in the sequence.
      const sortedUniqueDice = Array.from(new Set(currentDiceValues)).sort(
        (a, b) => a - b
      ); // unique values 0-5

      let smallStraightFound = false;
      // Check for sequence 1-2-3-4 (indices 0,1,2,3)
      if (
        sortedUniqueDice.includes(0) &&
        sortedUniqueDice.includes(1) &&
        sortedUniqueDice.includes(2) &&
        sortedUniqueDice.includes(3)
      )
        smallStraightFound = true;
      // Check for sequence 2-3-4-5 (indices 1,2,3,4)
      if (
        sortedUniqueDice.includes(1) &&
        sortedUniqueDice.includes(2) &&
        sortedUniqueDice.includes(3) &&
        sortedUniqueDice.includes(4)
      )
        smallStraightFound = true;
      // Check for sequence 3-4-5-6 (indices 2,3,4,5)
      if (
        sortedUniqueDice.includes(2) &&
        sortedUniqueDice.includes(3) &&
        sortedUniqueDice.includes(4) &&
        sortedUniqueDice.includes(5)
      )
        smallStraightFound = true;

      if (smallStraightFound && !currentLockedScores[SMALL_STRAIGHT_INDEX]) {
        newScores[SMALL_STRAIGHT_INDEX] = SMALL_STRAIGHT_SCORE;
      }

      // Large Straight (Sequence of 5 dice values)
      // Check for 1-2-3-4-5 or 2-3-4-5-6
      let largeStraightFound = false;
      // Check for sequence 1-2-3-4-5 (indices 0,1,2,3,4)
      if (
        sortedUniqueDice.includes(0) &&
        sortedUniqueDice.includes(1) &&
        sortedUniqueDice.includes(2) &&
        sortedUniqueDice.includes(3) &&
        sortedUniqueDice.includes(4)
      )
        largeStraightFound = true;
      // Check for sequence 2-3-4-5-6 (indices 1,2,3,4,5)
      if (
        sortedUniqueDice.includes(1) &&
        sortedUniqueDice.includes(2) &&
        sortedUniqueDice.includes(3) &&
        sortedUniqueDice.includes(4) &&
        sortedUniqueDice.includes(5)
      )
        largeStraightFound = true;

      if (largeStraightFound && !currentLockedScores[LARGE_STRAIGHT_INDEX]) {
        newScores[LARGE_STRAIGHT_INDEX] = LARGE_STRAIGHT_SCORE;
      }

      // Chance
      if (!currentLockedScores[CHANCE_INDEX]) {
        newScores[CHANCE_INDEX] = totalDiceValue;
      }

      // Yahtzee (Exactly 5 of a kind)
      if (hasYahtzee && !currentLockedScores[YAHTZEE_INDEX]) {
        newScores[YAHTZEE_INDEX] = YAHTZEE_SCORE;
      }
      // Yahtzee Bonus logic is handled in handleLockScore

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
      // setScoreValues(newPotentialScores);
    },
    [calculateScores]
  );

  // This effect runs whenever diceValues or lockedScores change
  // It keeps the potential scores updated based on the current dice and locked categories
  useEffect(() => {
    // Only update scores if not rolling, to prevent flickering during animation
    if (!rollingDice) {
      updateScores(diceValues, lockedScores, scoreValues);
    }
  }, [diceValues, lockedScores, rollingDice, scoreValues, updateScores]);

  const rollDice = useCallback(async () => {
    // Disable roll button and score buttons immediately
    if (rollsLeft <= 0 || rollingDice || gameOver) return;

    setRollingDice(true);
    const currentRoll = rollsLeft - 1;
    setRollsLeft(currentRoll);

    const ROLL_ANIMATION_COUNT = 4;
    const ANIMATION_FRAME_DELAY = 25;
    const ANIMATION_SET_DELAY = 50;

    // Animation loop
    for (let i = 0; i < ROLL_ANIMATION_COUNT; i++) {
      const animationValues = [...diceValues];
      for (let j = 0; j < NUMBER_OF_DICE; j++) {
        if (!diceHeld[j]) {
          animationValues[j] = Math.floor(Math.random() * NUMBER_OF_DICE_FACES);
        }
      }
      setDiceValues(animationValues);
      // Added await delay here for each frame update
      await delay(ANIMATION_FRAME_DELAY);
    }
    // Small delay between animation sets
    await delay(ANIMATION_SET_DELAY);

    // Final roll values
    const finalValues = [...diceValues];
    for (let j = 0; j < NUMBER_OF_DICE; j++) {
      if (!diceHeld[j]) {
        finalValues[j] = Math.floor(Math.random() * NUMBER_OF_DICE_FACES);
      }
    }
    setDiceValues(finalValues);

    // Update potential scores based on the final values
    updateScores(finalValues, lockedScores, scoreValues);

    setRollingDice(false);

    // Re-enable score buttons (handled by RenderScoreCell's disabled prop)
  }, [
    rollsLeft,
    rollingDice,
    diceValues,
    diceHeld,
    lockedScores,
    scoreValues,
    updateScores,
    delay,
    gameOver, // Added gameOver to dependency array
  ]);

  const nextTurn = useCallback(() => {
    setDiceHeld(Array(NUMBER_OF_DICE).fill(false));
    setRollsLeft(3);
    // Update potential scores with diceValues = [0,0,0,0,0] for the new turn start
    updateScores(Array(NUMBER_OF_DICE).fill(0), lockedScores, scoreValues);
    setDiceValues(Array(NUMBER_OF_DICE).fill(0)); // Reset dice visuals too
    // Automatically roll at the start of the next turn, similar to Xamarin code
    // Adding a small delay to allow state updates to propagate
    setTimeout(() => {
      rollDice();
    }, 100);
  }, [rollDice, lockedScores, scoreValues, updateScores]); // Added dependencies

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
    // Start the first turn with a roll after resetting
    setTimeout(() => {
      rollDice();
    }, 100);
  }, [rollDice]);

  // This effect runs whenever lockedScores changes to check for game over
  useEffect(() => {
    const allScoresLocked = lockedScores.every((locked) => locked);
    if (allScoresLocked && !gameOver) {
      setGameOver(true);
      const finalTotalScore = upperScoreTotal + lowerScoreTotal + bonusScore;
      Alert.alert(
        "Game Over!",
        `Upper Score: ${upperScoreTotal}\nBonus: ${bonusScore}\nLower Score: ${lowerScoreTotal}\n\nTotal Score: ${finalTotalScore}`,
        [{ text: "New Game", onPress: restartGame }]
      );
    }
  }, [
    lockedScores,
    gameOver,
    upperScoreTotal,
    lowerScoreTotal,
    bonusScore,
    restartGame,
  ]);

  const handleHoldDice = useCallback(
    (index: number) => {
      // Can hold dice only after the first roll (rollsLeft < 3) and not while rolling
      if (rollingDice || rollsLeft === 3 || gameOver) return;
      const newHeld = [...diceHeld];
      newHeld[index] = !newHeld[index];
      setDiceHeld(newHeld);
    },
    [diceHeld, rollingDice, rollsLeft, gameOver] // Added gameOver
  );

  const handleLockScore = useCallback(
    async (index: number) => {
      // Can lock score only if not rolling, score is not already locked, after first roll, and game not over
      if (rollingDice || lockedScores[index] || rollsLeft === 3 || gameOver) {
        return;
      }

      const scoreToLock = scoreValues[index];

      // Implement the "Are you sure you want to take a lower score?" logic from C#
      let highestScore = -1;
      for (let i = 0; i < NUMBER_OF_SCORES; i++) {
        // Find the highest available (unlocked) score, excluding Chance for comparison
        if (!lockedScores[i] && i !== CHANCE_INDEX) {
          if (scoreValues[i] > highestScore) {
            highestScore = scoreValues[i];
          }
        }
      }

      // If the selected score is lower than the highest available (and not the highest itself, preventing infinite loop)
      if (
        scoreToLock < highestScore &&
        scoreToLock !== scoreValues[highestScore]
      ) {
        const confirmLowerScore = await new Promise((resolve) => {
          Alert.alert(
            `Are you sure you want ${scoreToLock}?`,
            `There is a higher score available at ${highestScore}.`,
            [
              { text: "Yes", onPress: () => resolve(true) },
              { text: "No", style: "cancel", onPress: () => resolve(false) },
            ]
          );
        });

        if (!confirmLowerScore) {
          return; // User chose not to lock the lower score
        }
      }

      const newLockedScores = [...lockedScores];
      newLockedScores[index] = true;
      setLockedScores(newLockedScores);

      // The score being locked is the currently displayed score potential
      const newFinalScores = [...scoreValues];
      // newFinalScores[index] is already set to the potential value by updateScores
      // Let's calculate totals based on the newly locked score values

      let currentUpperTotal = 0;
      let currentLowerTotal = 0;
      let currentBonus = 0;
      let yahtzeeBonusEarned = 0; // Track Yahtzee bonuses for this lock action

      // Check for Yahtzee bonus BEFORE calculating base score totals
      // This uses the *current* dice values to see if a Yahtzee was rolled
      const diceFaceCount = Array(NUMBER_OF_DICE_FACES).fill(0);
      diceValues.forEach((value) => {
        diceFaceCount[value]++;
      });
      const isCurrentRollYahtzee = diceFaceCount.some((count) => count >= 5);

      // Yahtzee Bonus Logic: If Yahtzee is locked for 50 and the current roll is a Yahtzee,
      // award a bonus UNLESS this lock action is for the Yahtzee box itself and its score was 0.
      if (isCurrentRollYahtzee) {
        // Check if the Yahtzee box was already locked and had 50 points or more
        if (
          lockedScores[YAHTZEE_INDEX] &&
          scoreValues[YAHTZEE_INDEX] >= YAHTZEE_SCORE
        ) {
          yahtzeeBonusEarned = YAHTZEE_BONUS_SCORE;
          console.log("Yahtzee Bonus Earned!");

          // If this is a bonus Yahtzee, update the Yahtzee score visually
          // Although the bonus doesn't add to the Yahtzee box value itself,
          // the C# code appears to add it to scoreValues[YahtzeeIndex].
          // Let's replicate that visual update for consistency, though the bonus
          // is truly added to the lowerTotal.
          if (index !== YAHTZEE_INDEX) {
            // Only update the visual if locking *another* score
            newFinalScores[YAHTZEE_INDEX] += YAHTZEE_BONUS_SCORE; // Add bonus visually to Yahtzee score
          } else if (newFinalScores[YAHTZEE_INDEX] === YAHTZEE_SCORE) {
            // If locking the Yahtzee box itself for exactly 50, apply the bonus
            newFinalScores[YAHTZEE_INDEX] += YAHTZEE_BONUS_SCORE;
          }
        }
        // If the current roll is a Yahtzee and the Yahtzee box is NOT locked,
        // the scoreValues[YAHTZEE_INDEX] should already be 50 (calculated by updateScores)
        // and is correctly locked below.
      }

      // Calculate totals based on the NEW locked scores and FINALIZED values
      for (let i = 0; i < NUMBER_OF_SCORES; i++) {
        if (newLockedScores[i]) {
          // Use newLockedScores
          if (i < NUMBER_OF_LOWER_SCORES) {
            currentUpperTotal += newFinalScores[i]; // Use newFinalScores
          } else {
            // Lower total calculation needs to be careful with the Yahtzee bonus.
            // The bonus should be added to the *total*, not the individual box value (except for the visual update above).
            // Let's recalculate lower total based on the *final* locked values, and add the bonus separately.
          }
        }
      }

      // Recalculate lower total correctly based on locked scores
      let tempLowerTotal = 0;
      for (let i = NUMBER_OF_LOWER_SCORES; i < NUMBER_OF_SCORES; i++) {
        if (newLockedScores[i]) {
          // If the Yahtzee box is locked, the value in newFinalScores includes the base 50
          // and potentially Yahtzee bonuses added during THIS lock action for other scores.
          // We need to be careful not to double-count the bonus.
          // A simpler approach is to sum the base locked values, then add the bonus.
          if (i === YAHTZEE_INDEX) {
            // If Yahtzee is locked, add its base value (50)
            if (newFinalScores[YAHTZEE_INDEX] > 0) {
              // Check if Yahtzee was scored (not 0)
              tempLowerTotal += YAHTZEE_SCORE;
              // Any score beyond 50 in newFinalScores[YAHTZEE_INDEX] is a bonus that was added for visual purposes.
              // The actual bonus points are added to lowerTotal.
            }
          } else {
            tempLowerTotal += newFinalScores[i];
          }
        }
      }
      // Add the bonus earned in this specific turn's lock action
      tempLowerTotal += yahtzeeBonusEarned;

      // Recalculate the total number of bonus points based on all locked Yahtzees
      let totalYahtzeeBonuses = 0;
      if (
        newLockedScores[YAHTZEE_INDEX] &&
        newFinalScores[YAHTZEE_INDEX] > YAHTZEE_SCORE
      ) {
        // If Yahtzee box is locked and its value is > 50, calculate total bonuses stored there
        totalYahtzeeBonuses = newFinalScores[YAHTZEE_INDEX] - YAHTZEE_SCORE;
      }

      // Adjust lower total to include all earned Yahtzee bonuses correctly
      let recalculatedLowerTotal = 0;
      for (let i = NUMBER_OF_LOWER_SCORES; i < NUMBER_OF_SCORES; i++) {
        if (newLockedScores[i]) {
          if (i === YAHTZEE_INDEX) {
            // Add the base Yahtzee score if locked and scored
            if (newFinalScores[i] >= YAHTZEE_SCORE) {
              recalculatedLowerTotal += YAHTZEE_SCORE;
            }
          } else {
            recalculatedLowerTotal += newFinalScores[i];
          }
        }
      }
      // Add the total Yahtzee bonuses earned across all turns
      recalculatedLowerTotal += totalYahtzeeBonuses;

      if (currentUpperTotal >= BONUS_THRESHOLD) {
        currentBonus = BONUS_VALUE;
      }

      setUpperScoreTotal(currentUpperTotal);
      setLowerScoreTotal(recalculatedLowerTotal); // Use the correctly recalculated lower total
      setBonusScore(currentBonus);
      setScoreValues(newFinalScores); // Update final score values display

      // Check for game over after updating scores and totals
      const gamesOverCheck = newLockedScores.every((locked) => locked);
      setGameOver(gamesOverCheck);

      if (gamesOverCheck) {
        const finalTotalScore =
          currentUpperTotal + recalculatedLowerTotal + currentBonus; // Use recalculatedLowerTotal
        Alert.alert(
          "Game Over!",
          `Upper Score: ${currentUpperTotal}\nBonus: ${currentBonus}\nLower Score: ${recalculatedLowerTotal}\n\nTotal Score: ${finalTotalScore}`,
          [{ text: "New Game", onPress: restartGame }]
        );
      } else {
        // Only move to the next turn if the game is not over
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
      gameOver,
    ]
  );

  const handleNewGame = useCallback(() => {
    Alert.alert("New Game", "Are you sure you want to start a new game?", [
      { text: "Cancel", style: "cancel" },
      { text: "New Game", onPress: restartGame },
    ]);
  }, [restartGame]);

  return (
    <>
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
        {/* Placeholder to balance the layout */}
        <View
          style={{ width: styles.newGameButton.paddingHorizontal * 2 + 70 }}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.scoreGridContainer}>
          {/* Score Grid Rows */}
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Ones</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Ones"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Three of a kind</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Three of a kind"]}
              />
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Twos</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Twos"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Four of a kind</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Four of a kind"]}
              />
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Threes</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Threes"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Full House</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Full House"]}
              />
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Fours</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Fours"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Small Straight</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Small Straight"]}
              />
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Fives</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Fives"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Large Straight</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Large Straight"]}
              />
            </View>
          </View>
          <View style={styles.scoreGridRow}>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Sixes</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Sixes"]}
              />
            </View>
            <View style={styles.scoreLabelCell}>
              <Text style={styles.scoreLabelText}>Chance</Text>
            </View>
            <View style={styles.scoreValueCell}>
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Chance"]}
              />
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
              <RenderScoreCell
                rollsLeft={rollsLeft} // Pass rollsLeft
                rollingDice={rollingDice}
                gameOver={gameOver}
                lockedScores={lockedScores}
                scoreValues={scoreValues}
                handleLockScore={handleLockScore}
                index={scoreNameToIndex["Yahtzee"]}
              />
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
                { backgroundColor: "transparent" }, // Explicitly set background to transparent
              ]}
              // Can hold dice only after the first roll and not while rolling or game over
              disabled={rollsLeft === 3 || rollingDice || gameOver}
            >
              <Image
                // diceValues are 0-5, numbersToText indices are 0-5
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
            {rollingDice ? "Rolling..." : `${rollsLeft} Rolls left`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
