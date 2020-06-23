let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-70
canvas.width = window.innerWidth-70
let ctx = canvas.getContext('2d')

class Game{
    constructor(level,player,boss){
        this.level = level
        this.player = player
        this.boss= boss
        this.controls = {
            left:false,
            right:false,
            up:false
    }

    this.keyListener = (event) => {
        let keyState = (event.type == "keydown")? true:false;
        switch(event.key){
            case 'ArrowLeft':
            this.controls.left = keyState
            break
            case 'ArrowRight':
            this.controls.right = keyState
            break
            case ' ':
            this.controls.up = keyState
        }
    }

}

    playerBossCollision = (rect1, rect2) =>{

        if(rect1.grounded==false &&
           (!(rect1.y +rect1.height > rect2.y+15)) &&      
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

    projectileCollisionDetection = (rect1, rect2) => {
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
    this.projectileLeft=null
    this.projectileFiredLeft=false
    this.projectileRight=null
    this.projectileFiredRight=false
    }

    drawBoss = (x,y) => {

        if(this.cooldown!=0){
            this.color='red'
        }
        else{this.color='blue'}

        ctx.fillStyle=this.color
        ctx.fillRect(x, y, this.width, this.height)

    }

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
            }
    }

    attack2 = () =>{
        if(this.projectileFiredLeft==false && this.movingLeft==true){
            this.projectileFiredLeft=true    
            this.projectileLeft = new Projectile(this.x,this.y+(this.height/2))
            this.projectileLeft.xVelocity=this.xVelocity}
        
        if(this.projectileLeft!=null){    
            this.projectileLeft.xVelocity -=1.5
            ctx.fillStyle=this.projectileLeft.color
            ctx.fillRect(this.projectileLeft.x+=this.projectileLeft.xVelocity, this.projectileLeft.y, this.projectileLeft.width, this.projectileLeft.height)

        if(this.projectileLeft.x<0){
            this.projectileFiredLeft=false
            }
        }

        if(this.projectileFiredRight==false && this.movingRight==true){
            this.projectileFiredRight=true    
            this.projectileRight = new Projectile(this.x,this.y+(this.height/2))
            this.projectileRight.xVelocity=this.xVelocity}
            
            if(this.projectileRight!=null){    
                this.projectileRight.xVelocity +=1.5
                ctx.fillStyle=this.projectileRight.color
                ctx.fillRect(this.projectileRight.x+=this.projectileRight.xVelocity, this.projectileRight.y, this.projectileRight.width, this.projectileRight.height)

            if(this.projectileRight.x>canvas.width){
                this.projectileFiredRight=false
            }
        }

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

            for(const innerProperty in this.surfaces[property]){
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

    movePlayer = () => {

        if(g.controls.up && this.jumping==false){
            this.yVelocity-=35
            this.jumping=true
            this.grounded=false
        }

        if(g.controls.left){
            this.xVelocity-=0.5
        }

        if(g.controls.right){
            this.xVelocity+=0.5
        }

        this.yVelocity+=1.5;
        this.x += g.player.xVelocity;
        this.y+=g.player.yVelocity;
        this.xVelocity*=0.9
        this.yVelocity*=0.9
        this.grounded=false

        if(this.x<0){
            this.x=0
        }

        if(this.x>canvas.width-this.width){
            this.x=canvas.width-this.width
        }

    }
}

function animationLoop() {
    animationID = window.requestAnimationFrame(animationLoop)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    g.level.drawLevel()
    g.player.drawPlayer(g.player.x,g.player.y)
    g.boss.drawBoss(g.boss.x,g.boss.y)
    g.boss.attack1()

    document.getElementById('player-health').innerText=g.player.health
    document.getElementById('boss-health').innerText=g.boss.health

    if(g.boss.phase==2){
        g.boss.attack2()
        if(g.boss.projectileLeft != null)
            g.projectileCollisionDetection(g.player,g.boss.projectileLeft)
        if(g.boss.projectileRight != null)
            g.projectileCollisionDetection(g.player,g.boss.projectileRight)
    }

    g.player.movePlayer()

    if(g.floorDetection(g.player, g.level.surfaces.floor)){
        g.player.jumping=false
        g.player.y=g.level.surfaces.floor.y-g.player.height
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
}

let l = new Level({floor: {x:0, y:canvas.height-1, width:canvas.width,heigh:2}})
let p = new Player()
let b = new Boss()
let g = new Game(l,p,b)
g.boss.y=g.level.height-g.boss.height
g.boss.x=g.level.width-g.boss.width
g.player.x=0
g.player.y=g.level.height-g.player.height
window.addEventListener('keydown', g.keyListener)
window.addEventListener('keyup', g.keyListener)
animationLoop()
