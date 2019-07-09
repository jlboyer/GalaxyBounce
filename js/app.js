const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Planet {
  constructor(x, y){
    this.centerX = x;
    this.centerY = y;
    this.radius = Math.random()*10 + 10;
    this.attractF = 10;
  } 
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  };
}

class PlayerShip {
  constructor(){
    this.centerX = 0;
    this.centerY = 0;
    this.radius = 10;
    // this.repulseF = 10; not sure if i need this right now
  }
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

planetA = new Planet(300,300)

function animate() {
  clearCanvas();
  planetA.draw()
  console.log(planetA.centerX)
  window.requestAnimationFrame(animate)
}
animate()


function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)  
}

document.onmousemove = (evt) =>{
  planetA.centerX = getMousePos(canvas, evt).x
  planetA.centerY= getMousePos(canvas, evt).y
}

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}