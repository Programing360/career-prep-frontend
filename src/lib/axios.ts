import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/utils/storageHelpers';

export const AUTH_TOKEN_KEY = 'auth_token';

export function clearTokens(): void {
  removeStorageItem(AUTH_TOKEN_KEY);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // The refresh token is delivered as an HTTP-only cookie, so the browser must
  // send/store cookies on cross-origin requests to the API.
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStorageItem<string | null>(AUTH_TOKEN_KEY, null);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Backend global error handler contract (error.middleware.ts) */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    path: (string | number)[];
    message: string;
  }>;
}

export interface ApiError extends Error {
  errors?: ApiErrorResponse['errors'];
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && Array.isArray((error as ApiError).errors);
}

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let pendingQueue: PendingRequest[] = [];

function flushQueue(error: unknown, token?: string): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  pendingQueue = [];
}

function readAccessToken(body: unknown): string | undefined {
  const record = (body as Record<string, unknown> | null) ?? {};
  const payload =
    record.data && typeof record.data === 'object'
      ? (record.data as Record<string, unknown>)
      : record;
  return (
    (payload.accessToken as string | undefined) ??
    (payload.token as string | undefined) ??
    (payload.access_token as string | undefined)
  );
}

/**
 * Exchange the refresh token (sent automatically as an HTTP-only cookie) for a
 * new access token. Uses a bare axios call so a failed refresh never triggers
 * itself again.
 */
async function refreshAccessToken(): Promise<string> {
  const { data } = await api.post<unknown>('/auth/refresh');
  const accessToken = readAccessToken(data);
  if (!accessToken) {
    throw new Error('Refresh response did not include an access token.');
  }
  setStorageItem(AUTH_TOKEN_KEY, accessToken);
  return accessToken;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const serverErrors = error.response?.data?.errors;

    if (!error.response) {
      return Promise.reject(
        new Error(
          'Network error. Please check your internet connection and try again.'
        )
      );
    }

    if (status === 401) {
      const config = (error.config ?? {}) as RetryableConfig;
      const url = config.url ?? '';
      const isAuthRequest =
        url.includes('/auth/login') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/logout');

      if (!isAuthRequest && !config._retry) {
        config._retry = true;

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
              }
              return api(config);
            })
            .catch((refreshError) => Promise.reject(refreshError));
        }

        isRefreshing = true;
        return refreshAccessToken()
          .then((token) => {
            flushQueue(undefined, token);
            if (config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return api(config);
          })
          .catch((refreshError) => {
            flushQueue(refreshError);
            clearTokens();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      if (!isAuthRequest) {
        removeStorageItem(AUTH_TOKEN_KEY);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      return Promise.reject(
        new Error(
          serverMessage || 'Your session has expired. Please log in again.'
        )
      );
    }

    const requestError = new Error(
      serverMessage || error.message || 'An unexpected error occurred'
    ) as ApiError;
    requestError.errors = serverErrors;
    return Promise.reject(requestError);
  }
);

export default api;
