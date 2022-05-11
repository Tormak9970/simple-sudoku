import { get, writable } from "svelte/store";
import { Solver } from "./Solver";

// Menu stores
export const renderIdx = writable(0);
export const newGame = writable(false);
export const selectedDiff = writable("medium");

// Game stores
export const timer = writable("00:00:00");
export const solver = writable(new Solver());

export const initialSelect = writable(null);

export const selectedNumber = writable(null);
export const selectedSubCellId = writable(null);

export const inNoteMode = writable(false);
export const ctrlNumSelected = writable(null);

export const showRestart = writable(false);
export const restartCallback = writable(() => {});

export const errorsList = writable([]);

// Universal stores
export const theme = writable('dark');

export const rerender = writable(() => {
    const oVal = get(selectedNumber);
    selectedNumber.set("0");
    selectedNumber.set(oVal);
});

export const isPaused = writable(false);