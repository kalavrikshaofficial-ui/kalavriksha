import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parse error' });

    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'kala-vriksha',
        resource_type: 'auto',
      });
      return res.status(200).json({ url: result.secure_url });
    } catch (uploadErr) {
      console.error('Cloudinary error:', uploadErr);
      return res.status(500).json({ error: 'Upload failed' });
    }
  });
}
