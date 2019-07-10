const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.cursor = 'none';

// save canvas state 
ctx.save()

// Create gradient
let bckgrd = ctx.createRadialGradient(110, 375, 0, 0, 375, 1200)

// Add colors
bckgrd.addColorStop(0, 'rgba(255, 0, 106, 1.000)');
bckgrd.addColorStop(0.5, 'rgba(134, 0, 252, 0.500)');
bckgrd.addColorStop(1, 'rgba(14, 185, 247, 0.000)');

// Fill with gradient
ctx.fillStyle = bckgrd;
ctx.fillRect(0, 0, canvas.width, canvas.height);

//restore original canvas state
ctx.restore()

//Create effect to change color of ship by position
ctx.globalCompositeOperation = 'exclusion'

// Create ship gradient
let shipCenterX = 100
let shipCenterY = 375
let shipgrd = ctx.createRadialGradient(shipCenterX, shipCenterY, 0, shipCenterX, shipCenterY, 15);
      
// Add colors
shipgrd.addColorStop(0.000, 'rgba(252, 224, 10, 1.000)');
shipgrd.addColorStop(1.000, 'rgba(244, 33, 14, 1.000)');
ctx.fillStyle = shipgrd;

//Make ship
ctx.arc(shipCenterX,shipCenterY,15,0,2*Math.PI,false)
ctx.fill();
