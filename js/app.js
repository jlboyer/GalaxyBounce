const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.cursor = 'none';

class Attractor {
  constructor(x, y){
    this.centerX = x;
    this.centerY = y;
    this.radius = Math.random()*10 + 10;
    this.attractF = 10;
    this.satellites = [];
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
  drawAttractVector(){
    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = game.mouseX - this.centerX
    let vectorY = game.mouseY - this.centerY
    ctx.lineTo(this.centerX+vectorX,this.centerY+vectorY)
    ctx.strokeStyle = 'rgba(150, 150, 150, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
  drawTangentVector(){
    ctx.beginPath()
    ctx.moveTo(this.centerX,this.centerY)
    let vectorX = game.mouseX - this.centerX
    let vectorY = game.mouseY - this.centerY
    ctx.lineTo(this.centerX+vectorY, this.centerY-vectorX)
    ctx.strokeStyle = 'rgba(219, 10, 91, 1)';
    ctx.lineWidth = 2
    ctx.stroke()
  }
  drawSiblingVector(arrayOfSiblings){
      arrayOfSiblings.forEach( sibling => {
        ctx.beginPath()
        ctx.moveTo(this.centerX,this.centerY)
        let vectorX = sibling.centerX - this.centerX
        let vectorY = sibling.centerY - this.centerY
        ctx.lineTo(this.centerX + vectorX, this.centerY + vectorY)
        ctx.strokeStyle = 'rgba(46, 49, 49, 1)'
        ctx.lineWidth = 2
        ctx.stroke()
      })
  }
  updatePosition(){
  }
}



const game = {
  mouseX: 0,
  mouseY: 0,
  attractors: [],
  activeAttractorIndex: 0,
  initialize(){
    
    document.onmousemove = (evt) => {
      game.mouseX = this.getMousePos(canvas, evt).x
      game.mouseY= this.getMousePos(canvas, evt).y
    }
    
    let attractor = new Attractor(this.mouseX,this.mouseY)
    this.attractors.push(attractor)

    document.onclick = () => {
      let satellite = new Satellite(game.mouseX + game.attractors[0].radius*3,game.mouseY)
      game.attractors[0].satellites.push(satellite)
    }

    document.onkeydown = (evt) => {
      //Spacebar creates a new attractor and makes this the active attractor
      //KeyDown cycles the active attractor index 
      console.log(evt.code)
      switch (evt.code) {
        case "Space":
          let attractor = new Attractor(this.mouseX,this.mouseY)
          this.attractors.push(attractor)
          this.activeAttractorIndex = this.attractors.length - 1
          break;
        case "ArrowDown":
          if (this.activeAttractorIndex > this.attractors.length) {
            this.activeAttractorIndex--
          } else {
            this.activeAttractorIndex = this.attractors.length - 1
          }
          break;
        case "ArrowUp":
          if (this.activeAttractorIndex < this.attractors.length) {
            this.activeAttractorIndex++
          } else {
            this.activeAttractorIndex = 0
          }
          break;
        default:
          break;
      }
      /* if (evt.code = "Space") {
        let attractor = new Attractor(this.mouseX,this.mouseY)
        this.attractors.push(attractor)
      } else if*/
    }


    this.animate()
  },
  animate(){
    game.clearCanvas()

    game.attractors[0].centerX = game.mouseX
    game.attractors[0].centerY = game.mouseY
    game.attractors[0].draw()

    game.attractors.forEach(attractor => {
      attractor.satellites.forEach((satellite, index, array) => {
        satellite.draw()
        satellite.drawAttractVector()
        satellite.drawTangentVector()
        satellite.drawSiblingVector(array.slice(index))
      })
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
