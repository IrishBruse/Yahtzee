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
      // Parse the JSON string into an array
      const scores: HighscoreItem[] = JSON.parse(scoresJson);
      return scores;
    } else {
      // No scores saved yet
      return [];
    }
  } catch (error) {
    console.error("Failed to load high scores:", error);
    // Handle the error appropriately in your app
    return []; // Start with an empty list on error
  }
}

export async function addHighscore(newScore: number) {
  try {
    // 1. Load existing scores (or use current state if preferred, but loading is safer)
    const existingScoresJson = await AsyncStorage.getItem(
      HIGH_SCORES_STORAGE_KEY
    );
    const existingScores: HighscoreItem[] =
      existingScoresJson !== null ? JSON.parse(existingScoresJson) : [];

    // Create a temporary list with just the scores (rank is temporary)
    const scoresOnly = existingScores.map((item) => item.score);

    // 2. Add the new score
    scoresOnly.push(newScore);

    // 3. Sort in descending order
    scoresOnly.sort((a, b) => b - a);

    // 4. Keep only the top N scores
    const topScores = scoresOnly.slice(0, MAX_HIGH_SCORES);

    // 5. Assign ranks and format for state/storage
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
