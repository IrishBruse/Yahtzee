import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  NUMBER_OF_DICE,
  NUMBER_OF_SCORES,
  Orange,
  Red,
  diceImages,
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

  const handleNewGame = () => {
    console.log("handleNewGame");
  };

  const handleLockScore = async (index: number) => {
    console.log("handleLockScore", index);
  };

  const holdDice = (index: number) => {
    console.log("handleHoldDice", index);
  };

  const rollDice = async () => {
    console.log("rollDice");
  };

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
        <TouchableOpacity
          onPress={() => {
            console.log("stats");
          }}
          style={styles.newGameButton}
          disabled={rollingDice}
        >
          <Text style={styles.newGameButtonText}>Game Info</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.scoreGridContainer}>
          <Scores />
        </View>
        <View style={styles.diceContainer}>
          {diceValues.map((value, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => holdDice(index)}
              style={styles.diceButton}
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
  diceButton: {},
  diceHeld: {
    opacity: 0.6,
  },
  diceImage: {
    width: 70,
    height: 70,
    aspectRatio: 1,
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
});
