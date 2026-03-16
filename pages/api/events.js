import { readData, writeData } from '../../lib/data';
import { getSession } from '../../lib/session';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(readData('events'));
  }

  if (req.method === 'POST') {
    const session = getSession(req);
    if (!session || session.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { action } = req.body;
    const events = readData('events');

    if (action === 'add') {
      const { name, venue, date, about, preacher, price } = req.body;
      const newEvent = { id: Date.now().toString(), name, venue, date, about, preacher, price, status: 'upcoming' };
      events.push(newEvent);
      writeData('events', events);
      return res.status(200).json({ success: true, event: newEvent });
    }

    if (action === 'delete') {
      const { id } = req.body;
      const updated = events.filter(e => e.id !== id);
      writeData('events', updated);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
