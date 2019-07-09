const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Planet {
  constructor(){
    this.centerX = 0;
    this.centerY = 0;
    this.radius = Math.random()*10 + 10;
    this.attractF = 10;
  } 
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.stroke()
  };
}

class PlayerShip {
  constructor(){
    this.centerX = 0;
    this.centerY = 0;
    this.radius = Math.random()*10 + 10;
    this.attractF = 10;
  }
}

// const canvasElement = document.getElementsByTagName("canvas")

document.onmousemove = (evt) =>{
  console.log(evt)
  console.log(getMousePos(canvas, evt).x)
  console.log(getMousePos(canvas, evt).y)
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}