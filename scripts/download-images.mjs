/**
 * download-images.mjs
 * 
 * Utility script to download project images from Unsplash.
 * This is a development/setup task to populate placeholder images.
 * 
 * Usage: node scripts/download-images.mjs
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
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
    filename: 'project1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200',
    filename: 'project2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200',
    filename: 'project3.jpg'
  }
];

console.log('Starting downloads...');
Promise.all(images.map(img => downloadImage(img.url, img.filename)))
  .then(() => console.log('All images downloaded successfully'))
  .catch(error => console.error('Error downloading images:', error));