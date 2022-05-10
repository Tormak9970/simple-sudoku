import { get, writable } from "svelte/store";
import { Solver } from "./Solver";

export const theme = writable('dark');
export const timer = writable("00:00:00");
export const solver = writable(new Solver());

export const initialSelect = writable(null);

export const selectedNumber = writable(null);
export const selectedSubCellId = writable(null);

export const inNoteMode = writable(false);
export const ctrlNumSelected = writable(null);

export const rerender = writable(() => {
    const oVal = get(selectedNumber);
    selectedNumber.set("0");
    selectedNumber.set(oVal);
});

export const showRestart = writable(false);
export const restartCallback = writable(() => {});

export const isPaused = writable(false);