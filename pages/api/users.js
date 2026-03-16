import { readData } from '../../lib/data';
import { getSession } from '../../lib/session';
import { decryptPassword, isEncrypted } from '../../lib/crypto';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only admins can decrypt passwords
  const session = getSession(req);
  if (!session || session.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const users = readData('users');
  const result = users.map(u => ({
    username: u.username,
    fullname: u.fullname,
    email: u.email,
    phone: u.phone || '',
    role: u.role || 'user',
    password: isEncrypted(u.password) ? decryptPassword(u.password) : u.password,
  }));

  return res.status(200).json(result);
}
