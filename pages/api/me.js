import { getSession } from '../../lib/session';

export default function handler(req, res) {
  const session = getSession(req);
  if (!session) return res.status(200).json({ user: null });
  return res.status(200).json({ user: session });
}
