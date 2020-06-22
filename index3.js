let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-20
canvas.width = window.innerWidth-20
let ctx = canvas.getContext('2d')

let floor = {

	1:ctx.fillRect(0, canvas.height-1,2, canvas.width),
	}


class Game{
	constructor(level,player){
	this.level = level
	this.player = player
	this.controls = {
		left:false,
		right:false,
		up:false,

		keyListener: function(event){
			let keyState = (event.type == "keydown")? true:false;

			switch(event.key){
				case 'ArrowLeft':
				this.controls.left=keyState
				break
				case 'ArrowRight':
				this.controls.right=keyState
				break
				case ' ':
				this.controls.up = keyState
			}
		}
	}

	}


}

class Level {
	constructor(/*player, *//*surfaces*/){
		/*this.player=player*/
		/*this.surfaces=surfaces*/
		this.floor = [0, canvas.height-1, canvas.width,2]
		this.width = canvas.width
		this.height = canvas.height
	}

	drawLevel = () => {
		ctx.fillStyle='black'
		ctx.fillRect(this.floor[0],this.floor[1],this.floor[2],this.floor[3])
		

	}

}

class Player {

	constructor(){

		this.health = 10
		this.x =  0
        this.y = 0
        /*this.widthCanvas = 64
        this.heightCanvas = 64*/
        /*this.xImage = 0
        this.yImage = 64*11*/
        this.width = 64
        this.height = 64
        /*this.image = new Image()
        this.image.src = '../sprite.png'*/
        this.color = 'green'
        this.jumping = false
        this.yVelocity=0
        this.xVelocity = 0
	}

	drawPlayer = (x, y) =>{

		ctx.fillStyle = this.color
		ctx.fillRect(x, y, this.width, this.height)

	}


}

function animationLoop() {
    animationID = window.requestAnimationFrame(animationLoop)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    g.level.drawLevel()
    g.player.drawPlayer(g.player.x,g.player.y)

    if(g.controls.up && g.player.jumping==false){
    	g.player.yVelocity-=30
    	g.player.jumping=true
    }

    if(g.controls.left ){
    	g.player.xVelocity-=0.5
    }

    if(g.controls.right){
    	g.player.xVelocity+=0.5
    }

    g.player.yVelocity+=1.5;
    g.player.x += g.player.xVelocity;
    g.player.y+=g.player.yVelocity;
    g.player.xVelocity*=0.9
    g.player.yVelocity*=0.9

    if(g.player.y>canvas.height-g.player.height){
    	g.player.jumping=false
    	g.player.y=canvas.height-g.player.height
    	g.player.yVelocity=0
    }

    if(g.player.x<0){
    	g.player.x=0
    }

    if(g.player.x>g.level.width-g.player.width){
    	g.player.x=g.level.width-g.player.width
    }
}

let l = new Level()
let p = new Player()
let g = new Game(l,p)
g.level.drawLevel()
g.player.x=0
g.player.y=g.level.height-g.player.height
g.player.drawPlayer(g.player.x,g.player.y)
window.addEventListener('keydown', g.controls.keyListener)
window.addEventListener('keyup', g.controls.keyListener)
animationLoop()


/*let p = new Player(64,canvas.height-64)
		ctx.fillStyle = p.color*/
		/*ctx.fillRect(p.x, this.player.y+=10, this.player.width, this.player.height)*/
/*ctx.fillStyle = p.color
ctx.fillRect(p.x, p.y+=10, p.width, p.height)*/