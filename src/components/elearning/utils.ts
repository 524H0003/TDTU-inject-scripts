import type { CustomDeadline } from "./types";

export const CUSTOM_DEADLINE_STORAGE_KEY = "tdtu-custom-deadlines";

function isCustomDeadline(value: unknown): value is CustomDeadline {
  if (!value || typeof value !== "object") return false;

  const deadline = value as Partial<CustomDeadline>;
  return (
    typeof deadline.taskId === "string" &&
    typeof deadline.timestamp === "number" &&
    typeof deadline.createdAt === "number"
  );
}

export function loadCustomDeadlines(): Record<string, CustomDeadline> {
  try {
    const stored = localStorage.getItem(CUSTOM_DEADLINE_STORAGE_KEY);
    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Stored deadlines must be an object");
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => isCustomDeadline(value)),
    );
  } catch (error) {
    console.error("Failed to load custom deadlines:", error);
  }

  return {};
}

export function setCustomDeadline(taskId: string, timestamp: number): void {
  try {
    const stored = localStorage.getItem(CUSTOM_DEADLINE_STORAGE_KEY);
    let deadlines: Record<string, CustomDeadline> = {};
    if (stored) {
      deadlines = loadCustomDeadlines();
    }
    deadlines[taskId] = {
      taskId,
      timestamp,
      createdAt: Date.now(),
    };
    localStorage.setItem(
      CUSTOM_DEADLINE_STORAGE_KEY,
      JSON.stringify(deadlines),
    );
  } catch (e) {
    console.error("Failed to set custom deadline:", e);
  }
}

export function clearAllCustomDeadlines(): void {
  try {
    localStorage.removeItem(CUSTOM_DEADLINE_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear all custom deadlines:", e);
  }
}

export function removeCustomDeadline(taskId: string): void {
  try {
    const stored = localStorage.getItem(CUSTOM_DEADLINE_STORAGE_KEY);
    if (!stored) return;
    const deadlines = loadCustomDeadlines();
    delete deadlines[taskId];
    if (Object.keys(deadlines).length === 0) {
      localStorage.removeItem(CUSTOM_DEADLINE_STORAGE_KEY);
    } else {
      localStorage.setItem(
        CUSTOM_DEADLINE_STORAGE_KEY,
        JSON.stringify(deadlines),
      );
    }
  } catch (e) {
    console.error("Failed to remove custom deadline:", e);
  }
}

export function getTaskId(task: {
  courseId: number;
  instance: number;
  modname: string;
}): string {
  return `${task.courseId}-${task.instance}-${task.modname}`;
}

export function isTaskFinished(task: { completion?: number }): boolean {
  return task.completion === 100 || task.completion === 1;
}

export function formatDeadlineInput(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(
      "-",
    ) + `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
