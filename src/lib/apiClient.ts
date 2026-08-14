const BASE_URL = 'https://sgb-agro.onrender.com';
interface FetchOptions extends Omit<RequestInit, 'body'> {
  data?: any;
}

export const apiClient = async <T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { data, headers, method, ...customConfig } = options;

  // Ensure method is explicitly cast to a valid HTTP method string
  const httpMethod = method || (data ? 'POST' : 'GET');

  const config: RequestInit = {
    method: httpMethod,
    ...customConfig,
    headers: {
      ...headers,
    },
    credentials: 'include',
  };

  if (data) {
    if (data instanceof FormData) {
      config.body = data;
    } else {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/json',
      };
      config.body = JSON.stringify(data);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
};

export const authApi = {
  login: (credentials: any) => apiClient('/api/auth/login', { method: 'POST', data: credentials }),
  logout: () => apiClient('/api/auth/logout', { method: 'POST' }),
  getMe: () => apiClient('/api/auth/me', { method: 'GET' }),
};