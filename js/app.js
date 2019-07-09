const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

class Attractor {
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

class Satellite {
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
  mouseX: 0,
  mouseY: 0,
  attractor: {},
  satellites: [],
  initialize(){
    
    document.onmousemove = (evt) => {
      game.mouseX = this.getMousePos(canvas, evt).x
      game.mouseY= this.getMousePos(canvas, evt).y
      console.log(game.attractor)
    }
    
    document.onclick = (evt) => {
      game.mouseX = this.getMousePos(canvas, evt).x
      game.mouseY= this.getMousePos(canvas, evt).y
      let satellite = new Satellite(game.mouseX,game.mouseY)
      game.satellites.push(satellite)
    }

    const attractor = new Attractor(this.mouseX,this.mouseY)
    this.attractor = attractor

    this.animate()
  },
  animate(){
    game.clearCanvas()

    game.attractor.centerX = game.mouseX
    game.attractor.centerY = game.mouseY
    game.attractor.draw()

    game.satellites.forEach(object => {
      object.draw()
    })
    window.requestAnimationFrame(game.animate)
  },
  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)  
  },
  getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}


game.initialize()
