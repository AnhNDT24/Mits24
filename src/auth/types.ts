import type { CookieOptions } from 'express';

export type JwtPayload = {
  sub: string;
  email?: string;
  phone?: string;
};

export type LoginResult = {
  user: {
    id: number;
    email: string | null;
    phone: string | null;
    name: string;
    fullName?: string | null;
    avatar?: string | null;
    status?: string | null;
  };
  accessToken: string;
  refreshCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
};

export type RefreshResult = {
  accessToken: string;
  refreshCookie: {
    name: string;
    value: string;
    options: CookieOptions;
  };
};

export type RefreshCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};
