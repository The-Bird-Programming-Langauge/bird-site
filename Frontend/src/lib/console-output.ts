import { writable } from "svelte/store";

export const consoleOutput = writable<string[]>([]);