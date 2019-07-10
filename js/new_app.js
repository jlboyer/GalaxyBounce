const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
//canvas.style.cursor = 'none';

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

//restore original canvas state and save it again
ctx.restore()
ctx.save()
//Create effect to change color of ship by position
ctx.globalCompositeOperation = 'exclusion'

class Ship {
  constructor() {
    this.parentPlanet = {};
    this.radius = 15;
    this.centerX = 130;
    this.centerY = 375;
    this.orbitRadius = 45;
    this.orbitFreq = 1;
    this.angularVelocity = 2 * Math.PI * this.orbitFreq
    this.rotationAngle = 0;
    this.gradient = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.radius);
    this.colorStop1 = "rgba(252, 224, 10, 1)"
    this.colorStop2 = "rgba(244, 33, 14, 0)"
  }
  updateRotationAngle(){
    this.rotationAngle = this.angularVelocity*((2 * Math.PI) / 60)* time.getSeconds() + this.angularVelocity*((2 * Math.PI) / 60000) * time.getMilliseconds()
  }
  updateCenter(){
    this.centerX = this.orbitRadius * Math.cos(this.rotationAngle) + this.parentPlanet.centerX
    this.centerY = this.orbitRadius * Math.sin(this.rotationAngle) + this.parentPlanet.centerY
  }
  draw(){
    ctx.beginPath()
    this.gradient.addColorStop(0, this.colorStop1)
    this.gradient.addColorStop(1, this.colorStop2)
    ctx.fillStyle = this.gradient
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.fill()
  }
}

class Planet {
  constructor() {
    this.centerX = 80 //initialize with home will update for targets
    this.centerY = 375
    this.radius = Math.random()*20 + 10
    this.color = 'rgba(255, 255, 255, 1)'
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let ship = new Ship
let home = new Planet

ship.draw()
home.draw()