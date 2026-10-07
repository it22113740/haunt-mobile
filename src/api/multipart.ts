import { readAccessToken, runUnauthorized } from '@/api/client';
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

export type UploadPart = {
  uri: string;
  name: string;
  type: string;
};

function apiUrl(path: string): string {
  const base = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
  return `${base}${path}`;
}

export async function appendUploadPart(body: FormData, field: string, file: UploadPart): Promise<void> {
  if (Platform.OS === 'web') {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const type = file.type || blob.type || 'application/octet-stream';
    body.append(field, new File([blob], file.name, { type }));
    return;
  }

  body.append(field, { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
}

function toAxiosError(status: number, data: unknown): AxiosError {
  const config = { headers: {} } as InternalAxiosRequestConfig;
  const response = {
    data,
    status,
    statusText: '',
    headers: {},
    config,
  } as AxiosResponse;
  return new AxiosError('Request failed', String(status), config, undefined, response);
}

export function postMultipart<T>(path: string, body: FormData, onProgress?: (ratio: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    void (async () => {
      const token = await readAccessToken();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl(path));
      xhr.setRequestHeader('Accept', 'application/json');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable && event.total > 0) {
          onProgress(event.loaded / event.total);
        }
      };

      xhr.onerror = () => {
        reject(new Error('Could not reach the server.'));
      };

      xhr.onload = () => {
        let data: unknown = null;
        try {
          data = xhr.responseText ? (JSON.parse(xhr.responseText) as unknown) : null;
        } catch {
          data = null;
        }

        if (xhr.status === 401 && token) {
          void runUnauthorized();
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject(toAxiosError(xhr.status, data));
          return;
        }

        resolve(data as T);
      };

      xhr.send(body);
    })().catch(reject);
  });
}
