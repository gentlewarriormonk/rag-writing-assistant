// Basic utility functions if needed
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Delay for a specified milliseconds
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if running in browser environment
export const isBrowser = typeof window !== 'undefined'; 