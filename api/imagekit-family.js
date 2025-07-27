export default async function handler(req, res) {
  const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
  const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';
  const FOLDER = 'family';

  if (!IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ error: 'Missing IMAGEKIT_PRIVATE_KEY in environment variables.' });
  }

  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');

  try {
    const response = await fetch('https://api.imagekit.io/v1/files?path=/' + FOLDER, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }
    const files = await response.json();
    // files is an array of file objects
    const images = files
      .filter(file => file.type === 'file')
      .map(file => IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, ''));
    return res.status(200).json({ images });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
} 