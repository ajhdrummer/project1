let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-70
canvas.width = window.innerWidth-70
let ctx = canvas.getContext('2d')

const controls = {
		left:false,
		right:false,
		up:false,

		keyListener: function(event){
			let keyState = (event.type == "keydown")? true:false;

			switch(event.key){
				case 'ArrowLeft':
				controls.left = keyState
				break
				case 'ArrowRight':
				controls.right = keyState
				break
				case ' ':
				controls.up = keyState
			}
		}
	}

class Projectile {
    constructor(x,y){
        this.color='black'
        this.width=30
        this.height=5
        this.x=x
        this.y=y
        this.xVelocity=0
    }
}   

class Boss {
    constructor(){
    this.health = 41
    this.attacks=null
    this.width=75
    this.height=75
    this.x=0
    this.y=0
    this.xVelocity=0
    this.yVelocity=0
    this.phase=1
    this.color = 'blue'
    this.movingLeft=false
    this.movingRight=false
    this.cooldown=0
    this.projectiles=null
    this.projectileFired=false
    }

    drawBoss = (x,y) => {

        if(this.cooldown!=0){
            this.color='red'
        }
        else{this.color='blue'}

        ctx.fillStyle=this.color
        ctx.fillRect(x, y, this.width, this.height)

    }

    /*attack = () =>{

        if (this.phase==1){
            this.attack1()
        }

        if(this.phase==2){
            this.attack1()
            this.attack2()
        }
    }*/

    attack1 = () => {

        if(this.x >= canvas.width-this.width){
                this.movingRight=false
                this.movingLeft=true
                this.x=canvas.width-this.width
                this.xVelocity=0
            }

            if(this.movingLeft==true){    
                this.xVelocity-=0.5
                this.x += this.xVelocity;
/*              this.xVelocity*=.9
*/            
            }

            if(this.x <= 0){
                this.movingLeft=false
                this.movingRight=true
                this.x=1
                this.xVelocity=0
            }

            if(this.movingRight==true){
                this.xVelocity+=0.5
                this.x += this.xVelocity;
/*              this.xVelocity*=.9
*/            }

    }

    attack2 = () =>{
            if(this.projectileFired==false){
            this.projectileFired=true    
            this.projectiles = new Projectile(this.x,this.y+(this.height/2))}
        
            
       
        ctx.fillStyle=this.projectiles.color
        ctx.fillRect(this.projectiles.x-=10, this.projectiles.y, this.projectiles.width, this.projectiles.height)

        if(this.projectiles.x<0){
            this.projectileFired=false
        }
    
}
}



class Game{
	constructor(level,player,boss){
	this.level = level
	this.player = player
    this.boss= boss

	}

    playerBossCollision = (rect1, rect2) =>{

        if(rect1.grounded==false &&     
       rect1.x < rect2.x + rect2.width &&
       rect1.x + rect1.width > rect2.x &&
       rect1.y < rect2.y + rect2.height &&
       rect1.y + rect1.height > rect2.y){
            if(rect1.cooldown ==0){
            rect1.y=rect2.y-rect1.height
            if(rect2.cooldown==0){
                rect2.health-=1
                rect2.cooldown=20
            }
        }
        }

        if(rect1.x < rect2.x + rect2.width &&
       rect1.x + rect1.width > rect2.x &&
       rect1.y < rect2.y + rect2.height &&
       rect1.y + rect1.height > rect2.y){
            if(rect1.cooldown==0){
                rect1.health-=1
                rect1.cooldown=20
            }
        }

   }

    floorDetection = (rect1, rect2) => {
    return (rect1.y + rect1.height >= rect2.y)
    }

    platformDetection = (rect1, rect2) => {
    return (rect1.x < rect2.x + rect2.width &&
       rect1.x + rect1.width > rect2.x &&
       rect1.y < rect2.y + rect2.height &&
       rect1.y + rect1.height > rect2.y)
    }

    hitPlayerHead = (rect1, rect2) =>{
   return (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y<rect2.y+rect2.height&&
   rect1.y+rect1.height>rect2.y+(rect1.height/2))
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
        let a =[]
		for (const property in this.surfaces){

            for(let innerProperty in this.surfaces[property]){
                a.push(this.surfaces[property][innerProperty])}
		
            ctx.fillRect(a[0],a[1],a[2],a[3])
            a=[]
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
        this.grounded=false
        this.collision=false
        this.cooldown=0
	}

	drawPlayer = (x, y) =>{

        if(this.cooldown!=0){
            this.color='red'
        }
        else{this.color='green'}

		ctx.fillStyle = this.color
		ctx.fillRect(x, y, this.width, this.height)

	}
}

function animationLoop() {
    animationID = window.requestAnimationFrame(animationLoop)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    g.level.drawLevel()
    g.player.drawPlayer(g.player.x,g.player.y)
    g.boss.drawBoss(g.boss.x,g.boss.y)
    g.boss.attack1()
    if(g.boss.phase==2){
        g.boss.attack2()
    }
    document.getElementById('player-health').innerText=g.player.health
    document.getElementById('boss-health').innerText=g.boss.health

    if(controls.up && g.player.jumping==false){
    	g.player.yVelocity-=35
    	g.player.jumping=true
        g.player.grounded=false
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
    g.player.grounded=false

    if(g.player.x<0){
    	g.player.x=0
    }

    if(g.player.x>g.level.width-g.player.width){
    	g.player.x=g.level.width-g.player.width
    }

    if(g.hitPlayerHead(g.player, g.level.surfaces.plat1)){
        g.player.y=g.level.surfaces.plat1.y+2
        g.player.yVelocity=0
    }

    if(g.hitPlayerHead(g.player, g.level.surfaces.plat2)){
        g.player.y=g.level.surfaces.plat1.y+2
        g.player.yVelocity=0
    }

    if(g.floorDetection(g.player, g.level.surfaces.floor)){
        g.player.jumping=false
        g.player.y=g.level.surfaces.floor.y-g.player.height
        g.player.yVelocity=0
        g.player.grounded=true
    }

    if(g.platformDetection(g.player, g.level.surfaces.plat1)){
        g.player.jumping=false
        g.player.y=g.level.surfaces.plat1.y-g.player.height
        g.player.yVelocity=0
        g.player.grounded=true
    }

    if(g.platformDetection(g.player, g.level.surfaces.plat2)){
        g.player.jumping=false
        g.player.y=g.level.surfaces.plat1.y-g.player.height
        g.player.yVelocity=0
        g.player.grounded=true
    }

    g.playerBossCollision(g.player,g.boss)

    if(g.player.cooldown>0){
        g.player.cooldown-=1
    }

    if(g.boss.cooldown>0){
        g.boss.cooldown-=1
    }

    if(g.boss.health==40){
        g.boss.phase=2
    }

    
/*    g.boss.drawProjectile(g.boss.projectiles)
*/    
}

let level1Surfaces = {

	floor: {x:0, y:canvas.height-1, width:canvas.width,heigh:2},

	plat1: {x:canvas.width/7, y:canvas.height-150, width:200, height:2},

	plat2: {x:canvas.width*.75, y:canvas.height-150, width:200, height:2}
}


let l = new Level(level1Surfaces)
let p = new Player()
let b = new Boss()
let g = new Game(l,p,b)
g.boss.y=g.level.height-g.boss.height
g.boss.x=g.level.width-g.boss.width
g.player.x=0
g.player.y=g.level.height-g.player.height
window.addEventListener('keydown', controls.keyListener)
window.addEventListener('keyup', controls.keyListener)
animationLoop()
