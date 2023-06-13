import { enc, lib } from 'crypto-js';
import type { NextApiRequest } from 'next';
import { randomUUID } from "crypto";
import moment from "moment";
import { Session } from "next-auth";

export const createRandomString = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;

  let string = '';

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return string;
};

/**
 * Generates a password reset token that is safe to use in URLs.
 */
export function generatePasswordResetToken(length = 64): string {
  const tokenBytes = lib.WordArray.random(length);
  const tokenBase64 = enc.Base64.stringify(tokenBytes);
  return tokenBase64;
}

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Fetch the auth token from the request headers
export const extractAuthToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization || null;

  return authHeader ? authHeader.split(' ')[1] : null;
};

export const getAxiosError = (error: any): string => {
  if (error.response) {
    return error.response.data.error.message;
  }

  return error.message;
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password should be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Password should have at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password should have at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password should have at least one number
  if (!/\d/.test(password)) {
    return false;
  }

  // Password should have at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
};

export function formatStripeNumber(theNumber: number | any) {
  if (theNumber === undefined) {
    return "$0";
  }
  return "$" + theNumber / 100;
}

export function formatStripeNumberRaw(theNumber: number | any) {
  if (theNumber === undefined) {
    return 0;
  }
  return theNumber / 100;
}

export function formatAPIResponse(returnToClient: any, session: Session) {
  return {
    time: Date.now(),
    requestedBy: session.user?.id || "unknown",
    data: returnToClient,
  };
}

export function formatUnixDate(date: number) {
  return moment.unix(date).format("MM/DD/YYYY hh:mm:ssa");
}
export function formatPercentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}
export function newAPIKey() {
  return "SECRET" + randomUUID().replaceAll("-", "").toUpperCase();
}
