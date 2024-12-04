import { writable } from "svelte/store";

export const currentLanguage = writable<"bird" | "wasm">("bird");