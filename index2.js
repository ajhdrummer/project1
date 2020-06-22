let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-20
canvas.width = window.innerWidth-20
let ctx = canvas.getContext('2d')

let floor = {

	1:ctx.fillRect(0, canvas.height-1, canvas.width, 2),
	}

controls = {
		left:false,
		right:false,
		up:false,

		keyListener: function(event){
			let keyState = (event.type == "keydown")? true:false;

			switch(event.key){
				case 'ArrowLeft':
				controls.left=keyState
				break
				case 'ArrowRight':
				controls.right=keyState
				break
				case ' ':
				controls.up = keyState
			}
		}
	}

class Game{
	constructor(level,player){
	this.level = level
	this.player = player

	}


}

class Level {
	constructor(surfaces){
		this.surfaces=surfaces
		this.width = canvas.width
		this.height = canvas.height
	}

	drawLevel = () => {
		ctx.fillStyle='black'
		for (const property in this.surfaces){

			ctx.fillRect(this.surfaces[property][0],this.surfaces[property][1],this.surfaces[property][2],this.surfaces[property][3])

		}
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

    if(controls.up && g.player.jumping==false){
    	g.player.yVelocity-=30
    	g.player.jumping=true
    }

    if(controls.left){
    	g.player.xVelocity-=0.5
    }

    if(controls.right){
    	g.player.xVelocity+=0.5
    }

    g.player.yVelocity+=1.5;
    g.player.x += g.player.xVelocity;
    g.player.y+=g.player.yVelocity;
    g.player.xVelocity*=0.9
    g.player.yVelocity*=0.9


    /*for(const surface in g.level.surfaces){

    	if(g.player.y>g.level.surfaces[surface][1]-g.player.height){
    	g.player.jumping=false
    	g.player.y=g.level.surfaces[surface][1]-g.player.height
    	g.player.yVelocity=0
    }

    	console.log(g.level.surfaces[surface][1])
    }*/

    if(g.player.y>g.level.height-g.player.height){
    	g.player.jumping=false
    	g.player.y=g.level.height-g.player.height
    	g.player.yVelocity=0
    }

    if(g.player.x<0){
    	g.player.x=0
    }

    if(g.player.x>g.level.width-g.player.width){
    	g.player.x=g.level.width-g.player.width
    }
}

let level1Surfaces = {

	floor: [0, canvas.height-1, canvas.width,2],

	plat1: [200, canvas.height-120, 200, 2],

	plat2: [canvas.width-400,canvas.height-120,200,2]
}
let l = new Level(level1Surfaces)
let p = new Player()
let g = new Game(l,p)
g.level.drawLevel()
g.player.x=0
g.player.y=g.level.height-g.player.height
g.player.drawPlayer(g.player.x,g.player.y)
window.addEventListener('keydown', controls.keyListener)
window.addEventListener('keyup', controls.keyListener)
animationLoop()


/*let p = new Player(64,canvas.height-64)
		ctx.fillStyle = p.color*/
		/*ctx.fillRect(p.x, this.player.y+=10, this.player.width, this.player.height)*/
/*ctx.fillStyle = p.color
ctx.fillRect(p.x, p.y+=10, p.width, p.height)*/