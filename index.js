let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-20
canvas.width = window.innerWidth-20
let ctx = canvas.getContext('2d')

let floor = {

	1:ctx.fillRect(0, canvas.height-1, canvas.width, 2),
	}

class Game{
	constructor(level,player){
	this.level = level
	this.player = player
	}
}

class Level {
	constructor(/*player, *//*surfaces*/){
		/*this.player=player*/
		/*this.surfaces=surfaces*/
		this.floor = ctx.fillRect(0, canvas.height, 2, canvas.width)
		this.width = canvas.width
		this.height = canvas.height
		this.walkingSurfaces=[ctx.fillRect(0, canvas.height, 2, canvas.width)]
	}

	drawLevel = () => {
		ctx.fillStyle='black'
		

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
        this.jumpHeight = canvas.height - (this.height *3)
        this.jumping = false
        this.reachedJumpHeight=false
        this.jumpVelocity = 5
	}

	drawPlayer = (x, y) =>{

		ctx.fillStyle = this.color
		ctx.fillRect(x, y, this.width, this.height)

	}

	jump = () => {

		this.jumping=true

		if(this.y>=this.jumpHeight && this.reachedJumpHeight==false){
			this.y -= 5}

		if(this.y<=this.jumpHeight)
			this.reachedJumpHeight=true	

		if(this.reachedJumpHeight==true){
			this.y += 5}

		if(this.reachedJumpHeight==true && this.y==canvas.height-this.height){
			clearInterval(this.j)
			this.reachedJumpHeight=false
			this.jumping=false}		

	}

	move = (event) => {
        switch(event.key) {
            case ' ':
            	if(this.jumping==false)
            		this.j = setInterval(this.jump,30)
            break    
            case 'ArrowLeft':
                this.x -= 5
                break
            case 'ArrowRight':
                this.x+=5
                break
        
    }


	}
}

function animationLoop() {
    animationID = window.requestAnimationFrame(animationLoop)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    g.level.drawLevel()
    g.player.drawPlayer(g.player.x,g.player.y)
}

let l = new Level()
let p = new Player()
let g = new Game(l,p)
g.level.drawLevel()
g.player.x=0
g.player.y=g.level.height-g.player.height
g.player.drawPlayer(g.player.x,g.player.y)
document.onkeydown = (event) => g.player.move(event)
animationLoop()


/*let p = new Player(64,canvas.height-64)
		ctx.fillStyle = p.color*/
		/*ctx.fillRect(p.x, this.player.y+=10, this.player.width, this.player.height)*/
/*ctx.fillStyle = p.color
ctx.fillRect(p.x, p.y+=10, p.width, p.height)*/