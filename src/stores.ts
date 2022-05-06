import { writable } from "svelte/store";
import { Solver } from "./Solver";

export const theme = writable('dark');
export const timer = writable("00:00:00");
export const solver = writable(new Solver());

export const selectedNumber = writable(null);
export const selectedSubCellId = writable(null);
export const inNoteMode = writable(false);

export const isPaused = writable(false);