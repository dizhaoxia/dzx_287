import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export function generateToken(
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number = '7d',
): string {
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
