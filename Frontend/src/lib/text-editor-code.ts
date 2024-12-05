
import { writable } from "svelte/store";

export const textEditorCode = writable<string>("\n\nprint \"Hello World!\"\n\n");