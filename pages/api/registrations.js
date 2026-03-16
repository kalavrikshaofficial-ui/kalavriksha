import { readData, writeData } from '../../lib/data';
import { getSession } from '../../lib/session';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const session = getSession(req);

  // ── GET: fetch registrations ──────────────────────────────────
  if (req.method === 'GET') {
    if (!session) return res.status(403).json({ error: 'Forbidden' });
    const all = readData('registrations');
    if (session.role === 'admin') {
      all.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
      return res.status(200).json(all);
    }
    const mine = all
      .filter(r => r.userEmail === session.email || r.userName === session.fullname)
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    return res.status(200).json(mine);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── POST: detect content type ─────────────────────────────────
  const ct = req.headers['content-type'] || '';

  // JSON body = verify_payment action
  if (ct.includes('application/json')) {
    if (!session || session.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw);
      if (body.action === 'verify_payment') {
        const regs = readData('registrations');
        const idx = regs.findIndex(r => r.id === body.reg_id);
        if (idx !== -1) regs[idx].paymentStatus = 'verified';
        writeData('registrations', regs);
        return res.status(200).json({ success: true });
      }
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  // Multipart = payment registration with screenshot upload
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  return new Promise(resolve => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'File upload failed: ' + err.message });
        return resolve();
      }

      const get = k => Array.isArray(fields[k]) ? fields[k][0] : (fields[k] || '');

      const eventId       = get('eventId');
      const eventName     = get('eventName');
      const eventDate     = get('eventDate');
      const userName      = get('userName') || session.fullname;
      const userEmail     = get('userEmail') || session.email;
      const userPhone     = get('userPhone');
      const transactionId = get('transactionId');

      if (!transactionId) {
        res.status(400).json({ error: 'Transaction ID required.' });
        return resolve();
      }

      // Handle uploaded file
      let proofPath = '';
      const fileEntry = files.screenshot;
      const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;
      if (file && file.filepath) {
        const origName = file.originalFilename || file.newFilename || 'proof.jpg';
        const ext = path.extname(origName) || '.jpg';
        const newName = `proof_${Date.now()}${ext}`;
        const destPath = path.join(uploadsDir, newName);
        try {
          fs.renameSync(file.filepath, destPath);
          proofPath = `/uploads/proofs/${newName}`;
        } catch {
          proofPath = '';
        }
      }

      const reg = {
        id: `reg_${Date.now()}`,
        eventId, eventName, eventDate,
        userName, userEmail, userPhone,
        transactionId, proofPath,
        paymentStatus: 'pending',
        registrationDate: new Date().toISOString(),
      };

      const regs = readData('registrations');
      regs.push(reg);
      writeData('registrations', regs);

      res.status(200).json({ status: 'success', msg: 'Registration saved.' });
      resolve();
    });
  });
}
