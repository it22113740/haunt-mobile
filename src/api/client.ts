import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'haunt.accessToken';

let memoryToken: string | null = null;
let onUnauthorized: (() => Promise<void>) | null = null;
let handlingUnauthorized = false;

export function setAccessToken(token: string | null) {
  memoryToken = token;
}

export function setUnauthorizedHandler(handler: () => Promise<void>) {
  onUnauthorized = handler;
}

async function secureStoreAvailable(): Promise<boolean> {
  return SecureStore.isAvailableAsync();
}

export async function readAccessToken(): Promise<string | null> {
  if (memoryToken) return memoryToken;
  if (!(await secureStoreAvailable())) return null;
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function writeAccessToken(token: string): Promise<void> {
  memoryToken = token;
  if (!(await secureStoreAvailable())) return;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAccessToken(): Promise<void> {
  memoryToken = null;
  if (!(await secureStoreAvailable())) return;
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // The key is already gone.
  }
}

function requestUsedBearerToken(error: AxiosError): boolean {
  const headers = error.config?.headers;
  if (!headers) return false;

  const value =
    typeof headers.get === 'function'
      ? headers.get('Authorization')
      : headers.Authorization;

  return typeof value === 'string' && value.startsWith('Bearer ');
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, ''),
});

api.interceptors.request.use(async (config) => {
  const token = memoryToken ?? (await readAccessToken());
  if (token) {
    memoryToken = token;
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      requestUsedBearerToken(error) &&
      onUnauthorized &&
      !handlingUnauthorized
    ) {
      handlingUnauthorized = true;
      try {
        await onUnauthorized();
      } finally {
        handlingUnauthorized = false;
      }
    }
    return Promise.reject(error);
  },
);

export async function runUnauthorized(): Promise<void> {
  if (!onUnauthorized || handlingUnauthorized) return;
  handlingUnauthorized = true;
  try {
    await onUnauthorized();
  } finally {
    handlingUnauthorized = false;
  }
}

export function customInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  return api({
    ...config,
    ...options,
  }).then(({ data }) => data as T);
}

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
