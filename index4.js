let canvas = document.querySelector('#canvas')
canvas.height = window.innerHeight-70
canvas.width = window.innerWidth-70
let ctx = canvas.getContext('2d')
const audio = new Audio('BossMain.wav')
audio.volume = 0.4
audio.loop = true


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

    playerBossCollision = (player, boss) =>{

        if(player.grounded==false &&
           (!(player.y +player.height > boss.y+15)) &&      
           player.x < boss.x + boss.width &&
           player.x + player.width > boss.x &&
           player.y < boss.y + boss.height &&
           player.y + player.height > boss.y){
            if(player.cooldown ==0){
                player.jumping=true
                player.y=boss.y-player.height
                player.yVelocity=-30
            if(boss.cooldown==0){
                boss.health-=1
                boss.cooldown=20
                ctx.fillStyle='red'
                ctx.fillRect(boss.x+boss.width/4,boss.y,boss.width/2,3)
                }
            }
        }

        if(player.x < boss.x + boss.width-30 &&
           player.x + player.width > boss.x +30 &&
           player.y < boss.y + boss.height &&
           player.y + player.height > boss.y){
            if(player.cooldown==0){
                player.health-=1
                player.cooldown=20
                ctx.fillStyle='red'
                ctx.fillRect(player.x+player.width/4,player.y,player.width/2,3)
            }
        }

   }

    projectileCollisionDetection = (player, projectile) => {
        if(player.x < projectile.x + projectile.width &&
           player.x + player.width > projectile.x &&
           player.y < projectile.y + projectile.height &&
           player.y + player.height > projectile.y){
            if(player.cooldown==0){
                    player.health-=1
                    player.cooldown=20
                    ctx.fillStyle='red'
                    ctx.fillRect(player.x+player.width/4,player.y,player.width/2,3)
            }
        }
    }

    floorDetection = (player, floor) => {
        if(player.y + player.heightCanvas >= floor.y){
            player.jumping=false
            player.y=floor.y-player.heightCanvas
            player.yVelocity=0
            player.grounded=true
        }
    }
}

class Stalactite {
    constructor(x){
        this.color='purple'
        this.width=12
        this.height=60
        this.y=-this.height
        this.x=x
        this.yVelocity=0
    }
}

class Projectile {
    constructor(x,y){
        this.color='orange'
        this.width=30
        this.height=5
        this.x=x
        this.y=y
        this.xVelocity=0
    }
}   

class Boss {
    constructor(){
    this.health = 30
    this.width=120
    this.height=100
    this.x=0
    this.y=canvas.height-this.height
    this.xVelocity=0
    this.yVelocity=0
    this.phase=1
    this.movingLeft=false
    this.movingRight=false
    this.cooldown=0
    this.projectileLeft=null
    this.projectileFiredLeft=false
    this.projectileRight=null
    this.projectileFiredRight=false
    this.stalactites=[]
    this.iter = 0
    this.image= new Image()
    this.image.src = 'c.png'
    this.xImage = 4 
    this.yImage = 30
    this.imageWidth=68
    this.imageHeight=45
    this.speed=0.1
    }

    drawBoss = (x,y) => {

        ctx.drawImage(this.image, this.xImage, this.yImage, this.imageWidth, this.imageHeight, x,y, this.width, this.height) 
    }

    attack1 = () => {

        if(this.x >= canvas.width-this.width){
            this.movingRight=false
            this.movingLeft=true
            this.x=canvas.width-this.width
            this.xVelocity=0
            }

        if(this.movingLeft){    
            this.xVelocity-=this.speed
            this.x += this.xVelocity;

            if(Math.round(this.x)%5==0){
                this.xImage= (this.xImage + 72) % 432
            }
            }

        if(this.x <= 0){
            this.movingLeft=false
            this.movingRight=true
            this.x=1
            this.xVelocity=0
            }

        if(this.movingRight){
            this.xVelocity+=this.speed
            this.x += this.xVelocity; 
            if(Math.round(this.x)%5==0){
                this.xImage= (this.xImage + 72) % 432
            }          
            }
    }

    attack2 = () =>{
        if(this.projectileFiredLeft==false && this.movingLeft==true){
            this.projectileFiredLeft=true    
            this.projectileLeft = new Projectile(this.x,this.y+(this.height/2))
            this.projectileLeft.xVelocity=this.xVelocity}
        
        if(this.projectileLeft!=null){    
            this.projectileLeft.xVelocity -=1.3
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
                this.projectileRight.xVelocity +=1.3
                ctx.fillStyle=this.projectileRight.color
                ctx.fillRect(this.projectileRight.x+=this.projectileRight.xVelocity, this.projectileRight.y, this.projectileRight.width, this.projectileRight.height)

            if(this.projectileRight.x>canvas.width){
                this.projectileFiredRight=false
            }
        }

    }

    attack3 = () => {

        let s = new Stalactite(g.player.x+g.player.width/2-6)
        this.stalactites.push(s)

    }
}

class Level {
    constructor(surfaces){
        this.surfaces=surfaces
        this.width = canvas.width
        this.height = canvas.height
    }

    drawLevel = () => {
        ctx.fillStyle='white'
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
        this.widthCanvas = 72
        this.heightCanvas = 80
        this.xImage = 0
        this.yImage = 64*11
        this.width = 64
        this.height = 64
        this.image = new Image()
        this.image.src = 'playerspritesheet.png'
        this.jumping = false
        this.yVelocity=0
        this.xVelocity = 0
        this.grounded=false
        this.cooldown=0
        this.movingRight=true
        this.movingLeft=false
    }

    drawPlayer = (x, y) =>{

        ctx.drawImage(this.image, this.xImage, this.yImage, this.width, this.height, x,y, this.widthCanvas, this.heightCanvas) 

    }

    movePlayer = () => {

        if(g.controls.up && this.jumping==false){
            this.yVelocity-=40
            this.jumping=true
            this.grounded=false
        }

        if(g.controls.left){
            this.movingRight=false
            this.movingLeft=true
            this.xVelocity-=0.6
            this.yImage = 64*9
            this.xImage = (this.xImage + 64) % 576
        }

        if(g.controls.right){
            this.movingLeft=false
            this.movingRight=true
            this.xVelocity+=0.6
            this.yImage = 64*11
            this.xImage = (this.xImage + 64) % 576
        }

        this.yVelocity+=1.5;
        this.x += g.player.xVelocity;
        this.y+=g.player.yVelocity;
        this.xVelocity*=0.88
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

    if(g.boss.phase==2 || g.boss.phase==3){
        g.boss.attack2()
        if(g.boss.projectileLeft != null)
            g.projectileCollisionDetection(g.player,g.boss.projectileLeft)
        if(g.boss.projectileRight != null)
            g.projectileCollisionDetection(g.player,g.boss.projectileRight)
    }

    if(g.boss.phase==3){
        if(g.boss.iter%40==0){
        g.boss.attack3()
        }   
        g.boss.stalactites.forEach(stalactite =>{
            if(stalactite.y > canvas.height){
                g.boss.stalactites.splice(stalactite,1)
            }
            stalactite.yVelocity +=1.5
            ctx.fillStyle=stalactite.color
            ctx.fillRect(stalactite.x, stalactite.y+=stalactite.yVelocity, stalactite.width, stalactite.height)
            g.projectileCollisionDetection(g.player,stalactite)
        })
    }

    g.player.movePlayer()

    g.floorDetection(g.player, g.level.surfaces.floor)

    g.playerBossCollision(g.player,g.boss)

    if(g.player.cooldown>0){
        g.player.cooldown-=1
    }

    if(g.boss.cooldown>0){
        g.boss.cooldown-=1
    }

    if(g.boss.health==20){
        g.boss.phase=2
    }

    if(g.boss.health==10){
        g.boss.phase=3
    }

    if(g.boss.phase==2){
        g.boss.speed=0.15
    }

    if(g.boss.phase==3){
        g.boss.speed=0.2
    }

    g.boss.iter++

    if(g.player.health==0){
        document.getElementById('player-health').innerText=0
        window.cancelAnimationFrame(animationID)
        btn.innerText='You lose. Click to play again'
        btn.style.backgroundColor='red'
        canvas.remove()
        
    }

    if(g.boss.health==0){
        document.getElementById('boss-health').innerText=0
        window.cancelAnimationFrame(animationID)
        btn.innerText = 'You win! Click to play again'
        btn.style.backgroundColor='green'
        canvas.remove()
    }

}

let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
  animationLoop()
  audio.play()
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    animationLoop()
    audio.play()
  }
}
let btn = document.createElement('button')
btn.style.fontWeight='bold'
btn.style.marginTop='200px'
btn.style.height='100px'
document.getElementById('button-div').appendChild(btn)
btn.addEventListener('click', function(){location.reload()})
let l = new Level({floor: {x:0, y:canvas.height-1, width:canvas.width,heigh:2}})    
let p = new Player()
let b = new Boss()
let g = new Game(l,p,b)
g.boss.x=g.level.width-g.boss.width
g.player.x=0
g.player.y=g.level.height-g.player.height
window.addEventListener('keydown', g.keyListener)
window.addEventListener('keyup', g.keyListener)