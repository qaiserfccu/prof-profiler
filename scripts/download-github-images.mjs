/**
 * download-github-images.mjs
 * 
 * Utility script to download GitHub-related images from Unsplash.
 * This is a development/setup task to populate placeholder images.
 * 
 * Usage: node scripts/download-github-images.mjs
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = async (url, filename) => {
  const response = await axios({
    url,
    responseType: 'arraybuffer'
  });
  
  const imagePath = path.join(__dirname, '../public/images', filename);
  fs.writeFileSync(imagePath, response.data);
  console.log(`Downloaded: ${filename}`);
};

const images = [
  {
    url: 'https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?q=80&w=1200',
    filename: 'github1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200',
    filename: 'github2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200',
    filename: 'github3.jpg'
  }
];

console.log('Starting downloads...');
Promise.all(images.map(img => downloadImage(img.url, img.filename)))
  .then(() => console.log('All images downloaded successfully'))
  .catch(error => console.error('Error downloading images:', error));