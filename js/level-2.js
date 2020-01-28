

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var centerX = 425;
var centerY = 200;

var backgroundImg = new Image();
var enemyImg = new Image();
var enemyDeadImg = new Image();
var planetImg = new Image();

var character = null;

var enemies = new Array();
var keysDown = {};

var frametimeBefore = Date.now();
var level = 0;
var score = 0;
var cRect = canvas.getBoundingClientRect();      
var canvasX = 0;
var canvasY = 0;
    

function init() {
    //character and shot get generated and paired with a picture and their starting variables //
    character = { img: new Image(), posX:200, posY: 200, shooting: false, hp: 1000, speed: 300};
    shot = { img: new Image(), posX: 0, posY: 0, dirX: 0, dirY: 0, speed: 600 };
    //the picture variables get their picture//
    backgroundImg.src = "resources/level_2/Hintergrund.png";
    character.img.src = "resources/level_2/Spielcharacter.png";
    shot.img.src = "resources/level_2/Schuss.png";
    enemyImg.src = "resources/level_2/Gegner.png";
    enemyDeadImg.src = "resources/level_2/Splosion11.png";
    planetImg.src = "resources/level_2/Planetenoberflaeche1.png";
    //function to generate enemies is activated//    
    generateEnemies();
    // input events are initiated//
    window.addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
    window.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
    window.addEventListener("click", shoot, false);
    
}

//generate enemies//
function generateEnemies() {
    // everytime the function get renewed an level is added//
    ++level;
    
    for (var i = 0; i < level * 5; ++i)
    {
        // random Position
        var ranX = Math.floor(Math.random() * (canvas.width * 3)) - canvas.width;
        var ranY = Math.floor(Math.random() * (canvas.height * 3)) - canvas.height;
        // enemies get placed in the random position//
        enemies[enemies.length] = { img: enemyImg, posX: ranX, posY: ranY};
    }
}
// function for shooting//
function shoot(e) {
    // when a shot is activated the image gets placed on the character position//
    if(character.shooting) return;
    
    character.shooting = true;
    
    shot.posX = character.posX;
    shot.posY = character.posY;
    
    mouse(e);
    
	var x = canvasX - character.posX;
    var y = canvasY - character.posY;
    // shot gets released in calculated direction//
	var angle = Math.atan2(y, x);

	shot.dirX = Math.cos(angle);
    shot.dirY = Math.sin(angle);
    
        if(character.shooting) {
        document.getElementById("shot").play();
    }
}


function enemyLogic(i, frametime) {
    var x = character.posX - enemies[i].posX;
    var y = character.posY - enemies[i].posY;

    var angle = Math.atan2(y, x);
        
    enemies[i].posX += Math.cos(angle) * 300 * frametime;
    enemies[i].posY += Math.sin(angle) * 300 * frametime;
    // when the enemypositon and the shot position match the score gets higher and Image is shown for 30 cycles//
    if(character.shooting && 
       shot.posX  +16 >= enemies[i].posX && shot.posX -16 <= enemies[i].posX + 32 &&
       shot.posY +16 >= enemies[i].posY && shot.posY -16 <= enemies[i].posY + 32)
    {
        score = ++score;
        enemies[i].img = enemyDeadImg;
        enemies[i].deadcounter = 30;
        character.shooting = false;
        
    }
    // when the enemy position is on the character position, character loses health//
    if(character.hp > 0 &&
       enemies[i].posX >= character.posX && enemies[i].posX <= character.posX + 32 &&
       enemies[i].posY >= character.posY && enemies[i].posY <= character.posY + 32)
    {
        character.hp -= 50 * frametime;
    }   
}
// the logic of the game//
function logic(frametime) {
    // key are set to their keys//
    if(87 in keysDown) character.posY -= character.speed * frametime; // W
    if(65 in keysDown) character.posX -= character.speed * frametime; // A
    if(83 in keysDown) character.posY += character.speed * frametime; // S
    if(68 in keysDown) character.posX += character.speed * frametime; // D
        
        if(character.shooting)
        {
            shot.posX += shot.dirX * shot.speed * frametime;
            shot.posY += shot.dirY * shot.speed * frametime;

            if(shot.posX < 0 || shot.posX > canvas.width || shot.posY < 0 || shot.posY > canvas.height)
            {
                character.shooting = false;        
            }
           
        }
    //when the array's empty enemys spawn//

        for(var i = 0; i < enemies.length; ++i)
        {
            enemyLogic(i, frametime);
        }
    if(87 in keysDown){
        document.getElementById("space").play()
    }

        if(enemies.length == 0) generateEnemies();

    }

// draws the enitre canvas//
function draw() {
    // Hintergrund wird gemalt//
    ctx.drawImage(backgroundImg, 0, 0);
    // when an enemy dies it gets a new Image// 
    if(character.hp > 0)
    {
        for(var i = 0; i < enemies.length; ++i)
        {
           ctx.drawImage(enemies[i].img, enemies[i].posX, enemies[i].posY);
            if (enemies[i].deadcounter) {
                enemies[i].deadcounter--;
                if (enemies[i].deadcounter == 0) {
                    enemies.splice(i, 1);
                }
            }
        }

        ctx.drawImage(character.img, character.posX, character.posY);
        //when the player shoots, the shot get an Image//
        if(character.shooting)
        {
            ctx.drawImage(shot.img, shot.posX, shot.posY);
        }
        // text with respective font and score are drawn//
    ctx.font = "20px Agency FB";
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillText("Wave: " + level, 20, 30);
    ctx.fillText("Angriff der Ersianner",390,30);
    ctx.fillText("Score: " + score, 20, 60);
    ctx.fillText("HP: " + Math.ceil(character.hp), 20, 90);
    // when hp below 300 healthbar turns red//
        if (character.hp > 300)  
        {
         ctx.fillStyle = 'rgb(0, 255, 0)';
        }
        else 
        {
          ctx.fillStyle = 'rgb(255, 0, 0)';
            if(character.hp > 200){
                ctx.font = "50px Agency FB";
                ctx.fillText("!Warnung!", 355, 100);
            } 
        }
        ctx.fillRect(20,110,character.hp/10,10);  
    }
    // shown throungh this picture//
    ctx.drawImage(planetImg, centerX, centerY)
    
    if(level == 10) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("level_complete").classList.add("visible");  
        clearInterval(interval); // Needed for Chrome to end game
    }
    
    if(character.hp <= 0)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById("game_over").classList.add("visible");  
            clearInterval(interval); // Needed for Chrome to end game
        }
}
function mouse(e) 
{   // mouse gets a barier to canvas size//
     cRect = canvas.getBoundingClientRect();      
     canvasX = Math.round(e.clientX - cRect.left); 
     canvasY = Math.round(e.clientY - cRect.top);
    
}
function borders() {
    //variables for random position when planet touch//
    var randomY = Math.round(Math.random() * (520 - 0)) + 0;
    var randomX = Math.round(Math.random() * (924 - 0)) + 0;
    //when the character steps through the border half way gets set to the other side//
     if(character.posX < -16) { 
        character.posX = canvas.width -16;
            }
    if(character.posY < -16) {
       character.posY = canvas.height -16; 
    }
    if(character.posX +16 > canvas.width) {
        character.posX = 16;
    }
    if(character.posY +16 > canvas.height) {
        character.posY = 16;
    }
    //planet collision//
    if((character.posX > 409 && character.posX< 509) && (character.posY >184 && character.posY <284)){
        (character.posX = randomX) && (character.posY = randomY);  
    }
}

function gameLoop() {
    var now = Date.now();
    var frametime = (now - frametimeBefore) / 1000;
    
    logic(frametime);
    draw();
    borders();
    
    frametimeBefore = now;   
}
// the code gets renewed in intervals//
init();
setInterval(gameLoop, 0);