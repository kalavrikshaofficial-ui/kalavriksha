import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getSession } from '../../lib/session';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security: Check if user is logged in
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Please login to upload proof.' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('[Upload] Error:', err);
        const errorMsg = err.message.includes('maxFileSize') 
          ? 'File too large. Maximum size is 5MB.' 
          : 'Upload failed.';
        res.status(400).json({ error: errorMsg });
        return resolve();
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        res.status(400).json({ error: 'No valid image file detected' });
        return resolve();
      }

      // Security: Sanitize filename to prevent path traversal or weird characters
      const oldPath = file.filepath;
      const rawName = file.originalFilename || 'upload';
      const cleanName = `${Date.now()}-${rawName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const newPath = path.join(uploadDir, cleanName);
      
      try {
        fs.renameSync(oldPath, newPath);
        const url = `/uploads/${cleanName}`;
        res.status(200).json({ success: true, url });
        resolve();
      } catch (renameErr) {
        console.error('[Upload] Rename error:', renameErr);
        res.status(500).json({ error: 'Failed to process file' });
        resolve();
      }
    });
  });
}
