export interface User {
  _id: string; // Changed from id to _id
  name: string;
  email: string;
  token?: string; // Token might be included in the user object response
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}
