import { readData, writeData } from '../../lib/data';
import { setSession } from '../../lib/session';
import { encryptPassword, decryptPassword, isEncrypted } from '../../lib/crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body || {};
  if (!action) return res.status(400).json({ error: 'Missing action' });

  const users = readData('users');

  if (action === 'login') {
    const { identifier = '', password = '' } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const found = users.find(u => {
      const match = u.username === identifier.trim() || u.email === identifier.trim();
      if (!match) return false;

      // Compare: decrypt if encrypted, otherwise plain-text (backward compat)
      let storedPassword;
      if (isEncrypted(u.password)) {
        storedPassword = decryptPassword(u.password);
      } else {
        storedPassword = u.password;
      }
      return storedPassword === password;
    });

    if (!found) {
      return res.status(401).json({ error: 'Invalid credentials. The sanctuary remains closed to you.' });
    }

    // Auto-upgrade: encrypt plain-text password on successful login
    if (!isEncrypted(found.password)) {
      const idx = users.findIndex(u => u.username === found.username);
      users[idx].password = encryptPassword(password);
      writeData('users', users);
    }

    const session = {
      username: found.username,
      fullname: found.fullname,
      role: found.role || 'user',
      email: found.email,
      phone: found.phone || '',
      dob: found.dob || '',
    };
    setSession(res, session);
    return res.status(200).json({ role: session.role, fullname: session.fullname });
  }

  if (action === 'register') {
    const { fullname = '', username = '', email = '', dob = '', phone = '', password = '' } = req.body;
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    if (users.find(u => u.username === username.trim())) {
      return res.status(400).json({ error: 'That username is already claimed in the sacred circle.' });
    }
    if (users.find(u => u.email === email.trim())) {
      return res.status(400).json({ error: 'This gateway (email) is already linked to another seeker.' });
    }
    const newUser = {
      username: username.trim(), email: email.trim(), fullname: fullname.trim(),
      password: encryptPassword(password), role: 'user', dob: dob || '', phone: phone || '',
    };
    users.push(newUser);
    writeData('users', users);
    const session = { username: newUser.username, fullname: newUser.fullname, role: 'user', email: newUser.email, phone: newUser.phone, dob: newUser.dob };
    setSession(res, session);
    return res.status(200).json({ role: 'user', fullname: newUser.fullname });
  }

  if (action === 'forgot_password') {
    const { email = '', dob = '', new_password = '' } = req.body;
    if (!email || !dob || !new_password) {
      return res.status(400).json({ error: 'Please fill in all fields.' });
    }
    const idx = users.findIndex(u => u.email === email.trim() && u.dob === dob.trim());
    if (idx === -1) {
      return res.status(400).json({ error: 'No seeker found with these sacred details.' });
    }
    users[idx].password = encryptPassword(new_password);
    writeData('users', users);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Invalid action.' });
}
