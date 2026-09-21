import type { Completion, Habit } from "../types";

const HABITS_KEY = "ht21:habits";
const COMPLETIONS_KEY = "ht21:completions";
const SCHEMA_VERSION = 1;

interface StorageEnvelope<T> {
  version: number;
  items: T[];
}

function loadItems<T>(storage: Storage, key: string): T[] {
  const raw = storage.getItem(key);
  if (raw === null) return [];
  try {
    const parsed = JSON.parse(raw) as StorageEnvelope<T>;
    if (parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  } catch {
    return [];
  }
}

export function loadHabits(storage: Storage): Habit[] {
  return loadItems<Habit>(storage, HABITS_KEY);
}

export function saveHabits(storage: Storage, habits: Habit[]): void {
  storage.setItem(
    HABITS_KEY,
    JSON.stringify({ version: SCHEMA_VERSION, items: habits } satisfies StorageEnvelope<Habit>),
  );
}

export function loadCompletions(storage: Storage): Completion[] {
  return loadItems<Completion>(storage, COMPLETIONS_KEY);
}

export function saveCompletions(storage: Storage, completions: Completion[]): void {
  storage.setItem(
    COMPLETIONS_KEY,
    JSON.stringify({ version: SCHEMA_VERSION, items: completions } satisfies StorageEnvelope<Completion>),
  );
}
