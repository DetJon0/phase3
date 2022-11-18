export interface RegisterUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}
export interface UserData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserDataResponse {
  id: 'string';
  userName: 'string';
  normalizedUserName: 'string';
  email: 'string';
  normalizedEmail: 'string';
  emailConfirmed: boolean;
  passwordHash: 'string';
  securityStamp: 'string';
  concurrencyStamp: 'string';
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: 'string';
  lockoutEnabled: boolean;
  accessFailedCount: number;
  firstName: 'string';
  lastName: 'string';
  phoneNumber: 'string';
  role: 'string';
}
