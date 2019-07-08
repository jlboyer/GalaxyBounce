const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Planet = {
  constructor(){
    this.centerX: 0;
    this.centerY: 0;
    this.radius: Math.random()*10 + 10;
    this.attractF: 10;
  } 
  draw(){
    ctx.beginPath()
    ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,false)
    ctx.stroke()
  };
}

