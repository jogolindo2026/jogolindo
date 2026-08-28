import type { AppData } from '@/types';
import { seedData } from '@/data/seed';

const STORAGE_KEY = 'flamilia_data_v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(seedData);
      return seedData;
    }
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.pelada || !parsed.members) {
      saveData(seedData);
      return seedData;
    }
    return parsed;
  } catch {
    saveData(seedData);
    return seedData;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function resetData(): AppData {
  saveData(seedData);
  return seedData;
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
