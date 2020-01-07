var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var backgroundImg = new Image();
var enemyImg = new Image();

var character = null;
var fireball = null;

var enemies = {};
var keysDown = {};

var frametimeBefore = Date.now();
var level = 0;


function init()
{
	    character = { img: new Image(), posX: 200, posY: 200, shooting: false, hp: 1000, speed: 300 };
	    shot = { img: new Image(), posX: 0, posY: 0, dirX: 0, dirY: 0, speed: 600 };
	    
	    backgroundImg.src = 'resources/level_2/Hintergrund.jpg';
	    character.img.src = 'resources/level_2/SpielcharakterKlein.png';
	    shot.img.src = 'resources/level_2/Schuss.png';
	    enemyImg.src = 'resources/level_2/Gegner.png';
        window.addEventListener("keydown", function(e) {keysDown[e.keyCode] = true;}, false);
        window.addEventListener("keyup", function(e) {delete keysDown[e.keyCode];}, false);
        window.addEventListener("click", shoot, false);
    
        generateEnemies();
}

function draw()
{
	    ctx.drawImage(backgroundImg, 0, 0);
	    
	    if(character.hp > 0)
	    {
		        for(var i = 0; i < enemies.length; ++i)
		        {
			            ctx.drawImage(enemies[i].img, enemies[i].posX, enemies[i].posY);
		        }
		
		        ctx.drawImage(character.img, character.posX, character.posY);
		
		        if(character.shooting)
		        {
			            ctx.drawImage(shot.img, shot.posX, shot.posY);
		        }
	    }
	    
	    ctx.font = "20px Agency FB";
	    ctx.fillStyle = 'white';
	    ctx.fillText("Level: " + level, 20, 30)
	    ctx.fillText("HP: " + Math.ceil(character.hp), 20, 60);
}

function logic(frametime)
{
    if(87 in keysDown) character.posY -=character.speed*frametime;
    if(65 in keysDown) character.posX -=character.speed*frametime;
    if(83 in keysDown) character.posY +=character.speed*frametime;
    if(68 in keysDown) character.posX +=character.speed*frametime;
    
    if(character.shooting)
{
	   shot.posX += shot.dirX * shot.speed * frametime;
	   shot.posY += shot.dirY * shot.speed * frametime;
	
	   if(shot.posX < 0 || shot.posX > canvas.width || shot.posY < 0 || shot.posY > canvas.height)
	   {
		      character.shooting = false;        
	   }
}
    for(var i =0; i<enemies.lenght; ++i)
        {
            enemyLogic(i,frametime);
        }
    if(enemies.length ==0) generateEnemies();
}

function enemyLogic(i,frametime)
    {
        var x =character.posX-enemies[i].posX;
        var y =character.posY-enemies[i].posY;
        
        var angle = Math.atan2(y,x);
        
        enemies[i].posX +=Math.cos(angle)*200*frametime;
        enemies[i].posY +=Math.sin(angle)*200*frametime;
        
        if(character.shooting &&
          shot.posX >=enemies[i].posX&&shot.posX <=enemies[i].posX + 32 &&
          shot.posY >=enemies[i].posY&&shot.posY <=enemies[i].posY + 32)
            {
                enemies.splice(i,1);
                character.shooting =false;
            }
        if(character.hp >0 &&
          enemies[i].posX >=character.posX &&enemies[i].posX <character.posX + 32 &&
          enemies[i].posY >=character.posY &&enemies[i].posY <=character.posY +32)
            {
                character.hp -=50*frametime;
            }
    }

function generateEnemies()
{
    ++level;
    
    for(var i=0;i<level*3;++i)
        {
            var ranX = Math.floor(Math.random()*(canvas.width*3))-canvas.width;
            var ranY = Math.floor(Math.random()*(canvas.height*3))-canvas.width;
            
            enemies[enemies.lenght] = { img:enemyImg,posX:ranX,posY:ranY};
        }
}

function shoot(e)
{
    if(character.shooting) return;
    
    character.shooting = true;
    
    shot.posX = character.posX;
    shot.posY = character.posY;
    
    var x = e.clientX - character.posX;
    var y = e.clientY - character.posY;
    
    var angle = Math.atan2(y,x);
    
    shot.dirX = Math.cos(angle);
    shot.dirY = Math.cos(angle);
}

function gameLoop()
{
    var now = Date.now();
    var frametime = (now - frametimeBefore) / 1000;
    
    logic(frametime);
    draw();
    
    frametimeBefore = now;
}

init();
setInterval(gameLoop, 0);
