import { ImageRequireSource } from "react-native";

export const NUMBER_OF_DICE = 5;
export const NUMBER_OF_DICE_FACES = 6;
export const NUMBER_OF_SCORES = 13;
export const NUMBER_OF_LOWER_SCORES = 6;
export const THREE_OF_A_KIND_INDEX = 6;
export const FOUR_OF_A_KIND_INDEX = 7;
export const FULL_HOUSE_INDEX = 8;
export const SMALL_STRAIGHT_INDEX = 9;
export const LARGE_STRAIGHT_INDEX = 10;
export const CHANCE_INDEX = 11;
export const YAHTZEE_INDEX = 12;
export const FULL_HOUSE_SCORE = 25;
export const SMALL_STRAIGHT_SCORE = 30;
export const LARGE_STRAIGHT_SCORE = 40;
export const YAHTZEE_SCORE = 50;
export const YAHTZEE_BONUS_SCORE = 100;
export const BONUS_THRESHOLD = 63;
export const BONUS_VALUE = 35;
export const numbersToText = ["one", "two", "three", "four", "five", "six"];
export const DiceImages: Record<string, ImageRequireSource> = {
  one: require("../assets/dice/dice_one.png"),
  two: require("../assets/dice/dice_two.png"),
  three: require("../assets/dice/dice_three.png"),
  four: require("../assets/dice/dice_four.png"),
  five: require("../assets/dice/dice_five.png"),
  six: require("../assets/dice/dice_six.png"),
};
export const ScoreNameToIndex: Record<string, number> = {
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

export const ScoreNames = Object.keys(ScoreNameToIndex);

export const Red = "#CA2222";
export const Orange = "#EB9B3F";
