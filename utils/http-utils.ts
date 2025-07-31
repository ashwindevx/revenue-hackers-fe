// HTTP Utilities for Dropoff Scoring System
// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;


export const ENDPOINTS = {
  ALERTS: {
    GET_ALERTS: `/alerts/search`,
  },
  MERCHANTS: {
    LIST: '/merchants',
    DETAIL: (id: string) => `/merchants/${id}`,
  },
} as const;

// Request configuration interface
export interface RequestConfig {
  method?: keyof typeof HTTP_METHODS;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

// Response wrapper interface
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error response interface
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Custom error class
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// Build full URL with base URL
export const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>): string => {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// Default headers
const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Main HTTP request function
export const httpRequest = async <T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
  } = config;

  const url = buildUrl(endpoint, params);
  const requestHeaders = { ...getDefaultHeaders(), ...headers };

  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status,
        errorData.code || 'HTTP_ERROR',
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    
    throw new HttpError(
      0,
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
};

// Convenience methods
export const httpGet = <T = any>(endpoint: string, params?: Record<string, string | number | boolean>) => 
  httpRequest<T>(endpoint, { method: 'GET', params });

export const httpPost = <T = any>(endpoint: string, body?: any) => 
  httpRequest<T>(endpoint, { method: 'POST', body });

export const httpPut = <T = any>(endpoint: string, body?: any) => 
  httpRequest<T>(endpoint, { method: 'PUT', body });

export const httpDelete = <T = any>(endpoint: string) => 
  httpRequest<T>(endpoint, { method: 'DELETE' });

export const httpPatch = <T = any>(endpoint: string, body?: any) => 
  httpRequest<T>(endpoint, { method: 'PATCH', body });

// Utility function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof HttpError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Utility function to extract error message from API response
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An error occurred';
};

// Type-safe endpoint builder
export const buildEndpoint = (template: string, params: Record<string, string>): string => {
  let endpoint = template;
  Object.entries(params).forEach(([key, value]) => {
    endpoint = endpoint.replace(`:${key}`, value);
  });
  return endpoint;
}; 