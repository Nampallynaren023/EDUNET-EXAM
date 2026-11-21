import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

const ADMINS = [
  {
    email: (process.env.PRIMARY_ADMIN_EMAIL ?? '').toLowerCase(),
    password: process.env.PRIMARY_ADMIN_PASSWORD ?? '',
    name: 'Naren',
  },
  {
    email: (process.env.SECONDARY_ADMIN_EMAIL ?? '').toLowerCase(),
    password: process.env.SECONDARY_ADMIN_PASSWORD ?? '',
    name: 'Sainath',
  },
];

export function validateAdmin(email: string, password: string): { email: string; name: string } | null {
  const admin = ADMINS.find(
    (a) => a.email === email.toLowerCase().trim() && a.password === password
  );
  return admin ? { email: admin.email, name: admin.name } : null;
}

export function signAdminToken(payload: { email: string; name: string }): string {
  return jwt.sign({ ...payload, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyAdminToken(request: NextRequest): { email: string; name: string; role: string } {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { email: string; name: string; role: string };
  return decoded;
}
