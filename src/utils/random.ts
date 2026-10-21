import { faker } from '@faker-js/faker';

// Re-export faker for convenience
export { faker };

export function randomEmail(prefix = 'qa'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export function randomString(length = 8): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

export function randomInt(min = 1, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}