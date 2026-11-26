import fs from 'fs';
import path from 'path';

export function generateFavicon(photoFilename = 'beso-cafeteria.jpg') {
  const photoPath = path.resolve('public', 'photos', photoFilename);
  if (!fs.existsSync(photoPath)) {
    console.error(`Photo not found: ${photoPath}`);
    return false;
  }

  const base64 = fs.readFileSync(photoPath).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="squircle">
      <rect x="20" y="20" width="472" height="472" rx="115" />
    </clipPath>
  </defs>
  <!-- Background plate -->
  <rect width="512" height="512" rx="128" fill="#0b0710" />
  <!-- Embedded Photo -->
  <g clip-path="url(#squircle)">
    <image href="data:image/jpeg;base64,${base64}" x="20" y="20" width="472" height="472" preserveAspectRatio="xMidYMid slice" />
  </g>
  <!-- Elegant Champagne Gold Border -->
  <rect x="20" y="20" width="472" height="472" rx="115" fill="none" stroke="#e5c387" stroke-width="12" opacity="0.9" />
</svg>`;

  fs.writeFileSync(path.resolve('public', 'favicon.svg'), svg, 'utf8');
  console.log(`Updated public/favicon.svg with photo: ${photoFilename}`);
  return true;
}

const chosenPhoto = process.argv[2] || 'beso-cafeteria.jpg';
generateFavicon(chosenPhoto);
