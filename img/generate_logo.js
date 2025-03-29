/* Simple Quran logo for favicon and preview */
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#1D4B44';
ctx.fillRect(0, 0, 512, 512);

// Decorative border
ctx.strokeStyle = '#D4AF37';
ctx.lineWidth = 20;
ctx.strokeRect(40, 40, 432, 432);

// Text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 80px Amiri, serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('القرآن', 256, 200);

ctx.fillStyle = '#D4AF37';
ctx.font = 'bold 60px Roboto, sans-serif';
ctx.fillText('QURAN', 256, 300);

ctx.fillStyle = '#FFFFFF';
ctx.font = '30px Roboto, sans-serif';
ctx.fillText('EXPLORER', 256, 360);

// Export as PNG
const dataUrl = canvas.toDataURL('image/png');
const img = document.createElement('img');
img.src = dataUrl;
document.body.appendChild(img);

// To save: right-click on the image and select "Save Image As..."
