interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    username: string;
    role: string;
  };
}

export function login(credentials: LoginCredentials): Promise<LoginResponse>;
export function logout(): Promise<void>; 