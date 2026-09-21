import { describe, expect, it } from "vitest";
import { loadCompletions, loadHabits, saveCompletions, saveHabits } from "./localStorage";
import type { Completion, Habit } from "../types";

function createStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}

function createHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "h1",
    name: "Зарядка",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    startDate: "2026-09-21",
    timeOfDay: "morning",
    hour: 7,
    journalEnabled: false,
    status: "active",
    ...overrides,
  };
}

function createCompletion(overrides: Partial<Completion> = {}): Completion {
  return {
    habitId: "h1",
    date: "2026-09-21",
    markedAt: "2026-09-21T07:15:00.000Z",
    value: null,
    ...overrides,
  };
}

describe("хранилище: привычки", () => {
  it("пустое хранилище даёт пустой список", () => {
    const storage = createStorage();
    expect(loadHabits(storage)).toEqual([]);
  });

  it("сохранённые привычки загружаются без изменений", () => {
    const storage = createStorage();
    const habits = [
      createHabit(),
      createHabit({ id: "h2", name: "Чтение", timeOfDay: null, hour: null, journalEnabled: true }),
    ];
    saveHabits(storage, habits);
    expect(loadHabits(storage)).toEqual(habits);
  });

  it("битый JSON даёт пустой список", () => {
    const storage = createStorage();
    storage.setItem("ht21:habits", "{не json");
    expect(loadHabits(storage)).toEqual([]);
  });

  it("чужая версия схемы даёт пустой список", () => {
    const storage = createStorage();
    storage.setItem("ht21:habits", JSON.stringify({ version: 99, items: [createHabit()] }));
    expect(loadHabits(storage)).toEqual([]);
  });
});

describe("хранилище: отметки", () => {
  it("пустое хранилище даёт пустой список", () => {
    const storage = createStorage();
    expect(loadCompletions(storage)).toEqual([]);
  });

  it("сохранённые отметки загружаются без изменений, включая число дневника", () => {
    const storage = createStorage();
    const completions = [
      createCompletion(),
      createCompletion({ habitId: "h2", date: "2026-09-22", value: 42 }),
    ];
    saveCompletions(storage, completions);
    expect(loadCompletions(storage)).toEqual(completions);
  });

  it("битый JSON даёт пустой список", () => {
    const storage = createStorage();
    storage.setItem("ht21:completions", "ой");
    expect(loadCompletions(storage)).toEqual([]);
  });
});
