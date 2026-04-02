export const config = {
  api: { bodyParser: false }
};

import dbConnect from '../../lib/mongodb';
import Event from '../../models/Event';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  await dbConnect();

  // GET — fetch all events
  if (req.method === 'GET') {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ events });
  }

  // POST — parse as multipart always (formidable handles both form and JSON-like)
  if (req.method === 'POST') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parse error:', err);
        return res.status(500).json({ error: 'Form parse error' });
      }

      console.log('FIELDS:', JSON.stringify(fields));
      console.log('FILES:', JSON.stringify(files));

      // Helper to extract string value from formidable field (returns array in v3)
      const f = (key) => Array.isArray(fields[key]) ? fields[key][0] : fields[key] || '';

      const action = f('action');

      // DELETE action
      if (action === 'delete') {
        const eventId = f('eventId');
        await Event.findByIdAndDelete(eventId);
        return res.status(200).json({ success: true });
      }

      // ADD EVENT action
      let imagePath = '';
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      if (imageFile && imageFile.size > 0) {
        const ext = path.extname(imageFile.originalFilename || '.jpg');
        const newFilename = `event_${Date.now()}${ext}`;
        const destPath = path.join(uploadsDir, newFilename);
        fs.renameSync(imageFile.filepath, destPath);
        imagePath = `/uploads/${newFilename}`;
        console.log('Image saved to:', imagePath);
      } else {
        console.log('No image file received');
      }

      const newEvent = await Event.create({
        title: f('title'),
        type: f('type'),
        date: f('date'),
        price: f('price'),
        preacher: f('preacher'),
        description: f('description'),
        classLink: f('classLink'),
        venue: f('venue'),
        whatsappLink: f('whatsappLink'),
        image: imagePath,
      });

      console.log('Event created:', newEvent._id, 'image:', newEvent.image);
      return res.status(201).json({ success: true, event: newEvent });
    });

    return; // Important: prevent fallthrough
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
