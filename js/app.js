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
  constructor(x , y){
    this.centerX = x;
    this.centerY = y;
    this.radius = 10;
    this.velocity = 10;
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



const game = {
  objects: [],
  initialize(){
    let planetA = new Planet(300,300)
    this.objects.push(planetA)

    document.onmousemove = (evt) =>{
      game.objects[0].centerX = getMousePos(canvas, evt).x
      game.objects[0].centerY= getMousePos(canvas, evt).y
    }

    this.animate()
  },
  animate(){
    game.clearCanvas()
    game.objects.forEach(object => {
      object.draw()
    })
    window.requestAnimationFrame(game.animate)
  },
  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)  
  }
}


game.initialize()



document.onclick = (evt) =>{
  let shipA = new PlayerShip(getMousePos(canvas, evt).x + planetA.radius*3,getMousePos(canvas, evt).y + planetA.radius*3)
  console.log(shipA)
  console.log(getMousePos(canvas, evt).x + planetA.radius*3)
  console.log(getMousePos(canvas, evt).y + planetA.radius*3)
  shipA.draw()
}

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}