import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data;
  if (!data || typeof data !== 'object' || !('message' in data)) return fallback;

  const message = data.message;
  if (typeof message === 'string' && message.length > 0) return message;
  if (Array.isArray(message)) {
    const lines = message.filter((item): item is string => typeof item === 'string');
    if (lines.length > 0) return lines.join('\n');
  }

  return fallback;
}
