import { writable, type Writable } from "svelte/store";
import { Solver } from "./lib/Solver";

// Menu stores
export const showMenu = writable(true);
export const newGame = writable(false);
export const selectedDifficulty = writable("medium");

// Game stores
export const timer = writable("00:00:00");
export const solver = writable(new Solver());
export const board = writable("");
export const notes = writable({});
export const moves = writable([]);

export const firstSelected: Writable<"ctrl" | "cell" | null> = writable(null);

export const selectedNumber = writable(null);
export const selectedSubCellId = writable(null);

export const inNoteMode = writable(false);
export const selectedControlNumber = writable(null);

export const showRestart = writable(false);
export const restartCallback = writable(() => {});

export const showVictory = writable(false);
export const bestTime = writable(null);
export const currentTimeIsBest = writable(false);

export const errorsList = writable([]);

// Universal stores
export const theme = writable("dark");

export const isPaused = writable(false);