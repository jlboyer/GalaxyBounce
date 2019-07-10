const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.cursor = 'none';


// Create gradient
let grd = ctx.createRadialGradient(0, 375, 0, 0, 375, 1200)

// Add colors
grd.addColorStop(0, 'rgba(255, 0, 106, 1.000)');
grd.addColorStop(0.5, 'rgba(134, 0, 252, 0.500)');
grd.addColorStop(1, 'rgba(14, 185, 247, 0.000)');

// Fill with gradient
ctx.fillStyle = grd;
ctx.fillRect(0, 0, canvas.width, canvas.height);