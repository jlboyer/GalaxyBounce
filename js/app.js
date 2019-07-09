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
    this.radius = Math.random()*10 + 10;
    // this.repulseF = 10; not sure if i need this right now
  }
}

planetA = new Planet(300,300)
planetA.draw()

document.onmousemove = (evt) =>{
  // console.log(getMousePos(canvas, evt).x)
  // console.log(getMousePos(canvas, evt).y)
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}