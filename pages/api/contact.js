import { readData, writeData } from '../../lib/data';
import { getSession } from '../../lib/session';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const session = getSession(req);
    if (!session || session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const interactions = readData('interactions');
    interactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.status(200).json(interactions);
  }

  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
    const interactions = readData('interactions');
    interactions.push({ id: Date.now().toString(), name, email, message, date: new Date().toISOString() });
    writeData('interactions', interactions);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
