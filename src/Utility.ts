import AsyncStorage from "@react-native-async-storage/async-storage";
import { HIGH_SCORES_STORAGE_KEY, MAX_HIGH_SCORES } from "./constants";

export type HighscoreItem = {
  rank: number;
  score: number;
  date: number;
};

export async function loadHighscores() {
  try {
    const scoresJson = await AsyncStorage.getItem(HIGH_SCORES_STORAGE_KEY);
    if (scoresJson !== null) {
      const scores: HighscoreItem[] = JSON.parse(scoresJson);
      return scores;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to load high scores:", error);
    return [];
  }
}

export async function addHighscore(newScore: number) {
  try {
    const existingScoresJson = await AsyncStorage.getItem(
      HIGH_SCORES_STORAGE_KEY
    );
    const existingScores: HighscoreItem[] =
      existingScoresJson !== null ? JSON.parse(existingScoresJson) : [];

    const scoresOnly = existingScores.map((item) => item.score);

    scoresOnly.push(newScore);

    scoresOnly.sort((a, b) => b - a);

    const topScores = scoresOnly.slice(0, MAX_HIGH_SCORES);

    const updatedHighscores: HighscoreItem[] = topScores.map(
      (score, index) => ({
        rank: index + 1,
        score: score,
        date: Date.now(),
      })
    );

    // 6. Save the updated list back to AsyncStorage
    await AsyncStorage.setItem(
      HIGH_SCORES_STORAGE_KEY,
      JSON.stringify(updatedHighscores)
    );
  } catch (error) {
    console.error("Failed to save high score:", error);
    // Handle the error appropriately
  }
}
