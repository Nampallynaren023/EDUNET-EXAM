import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const clean = (val?: string) => (val ? val.trim().replace(/^["']|["']$/g, '') : '');

const JWT_SECRET = clean(process.env.JWT_SECRET) || 'EduNet@Sainath2024#SecureJWT_Key_Min32Chars!';

const getAdmins = () => [
  {
    email: (clean(process.env.PRIMARY_ADMIN_EMAIL) || 'nampallynaren16@gmail.com').toLowerCase(),
    password: clean(process.env.PRIMARY_ADMIN_PASSWORD) || 'EduNetAdmin@Naren2024!',
    name: 'Naren',
  },
  {
    email: (clean(process.env.SECONDARY_ADMIN_EMAIL) || 'sainathdevath9@gmail.com').toLowerCase(),
    password: clean(process.env.SECONDARY_ADMIN_PASSWORD) || 'EduNetAdmin@Sainath2024!',
    name: 'Sainath',
  },
];

export function validateAdmin(email: string, password: string): { email: string; name: string } | null {
  if (!email || !password) return null;
  const cleanEmail = email.toLowerCase().trim();
  const cleanPassword = clean(password);

  const admins = getAdmins();
  const admin = admins.find(
    (a) => a.email === cleanEmail && a.password === cleanPassword
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
