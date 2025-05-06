// API Types
export interface Page {
  id: string;
  title: string;
  content: string;
  language: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  error?: string;
}

// API Functions
export async function getPage(key: string, language: string): Promise<Page> {
  const response = await fetch(`/api/pages/${key}?language=${language}`);
  if (!response.ok) throw new Error('Failed to fetch page');
  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function getMessages(): Promise<Message[]> {
  const response = await fetch('/api/messages');
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export async function deleteMessage(id: string): Promise<void> {
  const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete message');
}

export async function replyMessage(id: string, reply: string): Promise<void> {
  const response = await fetch(`/api/messages/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply }),
  });
  if (!response.ok) throw new Error('Failed to reply to message');
}

export async function submitMessage(data: Omit<Message, 'id' | 'createdAt' | 'status'>): Promise<void> {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit message');
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  if (!response.ok) throw new Error('Failed to logout');
} 