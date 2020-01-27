

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
    //Charakter und Schuss werden initiert und der Charakter mit Lebenspunkten und anderen wichtigen Startwerten wie einer Bildvariable versehen.//
    character = { img: new Image(), posX:200, posY: 200, shooting: false, hp: 1000, speed: 300};
    shot = { img: new Image(), posX: 0, posY: 0, dirX: 0, dirY: 0, speed: 600 };
    //Die benötigten Bilder werden jeweils den passenden Variablen zugeordnet.//
    backgroundImg.src = "resources/level_2/Hintergrund.png";
    character.img.src = "resources/level_2/Spielcharacter.png";
    shot.img.src = "resources/level_2/Schuss.png";
    enemyImg.src = "resources/level_2/Gegner.png";
    enemyDeadImg.src = "resources/level_2/Splosion11.png";
    planetImg.src = "resources/level_2/Planetenoberflaeche1.png";
    //Die Funktion zum generieren von Gegnern wird aufgerufen.//    
    generateEnemies();
    // Die Eingabe-Ereignisse verden Eventlistenern Variablen zugeordent//
    window.addEventListener("keydown", function (e) { keysDown[e.keyCode] = true; }, false);
    window.addEventListener("keyup", function (e) { delete keysDown[e.keyCode]; }, false);
    window.addEventListener("click", shoot, false);
    
}

//Funktion zum gernerieren von Gegnern//
function generateEnemies() {
    // jedes mal wenn die Funktionaufgerufen wird ein Level erhöht//
    ++level;
    
    for (var i = 0; i < level * 5; ++i)
    {
        // random Position
        var ranX = Math.floor(Math.random() * (canvas.width * 3)) - canvas.width;
        var ranY = Math.floor(Math.random() * (canvas.height * 3)) - canvas.height;
        // Wenn gegner da sind wird ihnen ein Bild und eine Random X und Y Position zugeordnet//
        enemies[enemies.length] = { img: enemyImg, posX: ranX, posY: ranY};
    }
}
// Funktionzum initiieren des Schusses//
function shoot(e) {
    // Wenn der Spielcharakter schießen aktiviert hat wird die Startposition des Schusses auf die Charakterpostion gesetzt//
    if(character.shooting) return;
    
    character.shooting = true;
    
    shot.posX = character.posX;
    shot.posY = character.posY;
    
    mouse(e);
    
	var x = canvasX - character.posX;
    var y = canvasY - character.posY;
    // der Schuss wird nun in die berechnete Richtung losgelassen//
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
        
    enemies[i].posX += Math.cos(angle) * 200 * frametime;
    enemies[i].posY += Math.sin(angle) * 200 * frametime;
    // Wenn die Gegnerposition und die Position des Schusses übereinstimmen wird der Score erhöht ind ein Bild für 30 Zyklen gezeigt//
    if(character.shooting && 
       shot.posX  +16 >= enemies[i].posX && shot.posX -16 <= enemies[i].posX + 32 &&
       shot.posY +16 >= enemies[i].posY && shot.posY -16 <= enemies[i].posY + 32)
    {
        score = ++score;
        enemies[i].img = enemyDeadImg;
        enemies[i].deadcounter = 30;
        character.shooting = false;
        
    }
    // Wenn die Charakter HP größer als 0 sind und ein Gegner auf seiner Position steht wird dem Spieler 50 HP abgezogen//
    if(character.hp > 0 &&
       enemies[i].posX >= character.posX && enemies[i].posX <= character.posX + 32 &&
       enemies[i].posY >= character.posY && enemies[i].posY <= character.posY + 32)
    {
        character.hp -= 50 * frametime;
    }   
}
// Die Logik des Spiels wird Festgelegt//
function logic(frametime) {
    // Den Aktionstasten werden Aktionen zugeordenet//
    if(87 in keysDown) character.posY -= character.speed * frametime;  // W
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
    //Wenn im Gegner Array nichts mehr vorhanden ist werden neue Gegner generiert//

        for(var i = 0; i < enemies.length; ++i)
        {
            enemyLogic(i, frametime);
        }
    if(87 in keysDown){
        document.getElementById("space").play()
    }

        if(enemies.length == 0) generateEnemies();

    }

// Mit dieser funktion wird die gesamte Darstellung gemalt//
function draw() {
    // Hintergrund wird gemalt//
    ctx.drawImage(backgroundImg, 0, 0);
    // Wenn ein gegner Stirbt wird ihm ein anderes Bild zugeordnet und danach wird er entfernt// 
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
        //Wenn der Spieler schießt wird dem Schuss ein Bild zugeordnet//
        if(character.shooting)
        {
            ctx.drawImage(shot.img, shot.posX, shot.posY);
        }
        // Die Schrift wird mit Farbe und den Score generiert//
    ctx.font = "20px Agency FB";
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillText("Wave: " + level, 20, 30);
    ctx.fillText("Level 2",850,30)
    ctx.fillText("Angriff der Ersianner",390,30)
    ctx.fillText("Score: " + score, 20, 60);
    ctx.fillText("HP: " + Math.ceil(character.hp), 20, 90);
    // Wenn die HP unter 300 sinkt wird der Balken Rot eingefärbt//
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
    // Durch ein Bild dargestellt//
    ctx.drawImage(planetImg, centerX, centerY)
    
    if(level == 11) {
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
{
     cRect = canvas.getBoundingClientRect();      
     canvasX = Math.round(e.clientX - cRect.left); 
     canvasY = Math.round(e.clientY - cRect.top);
    
}
function borders() {
     if(character.posX < 0) {
        character.posX = 0;
            }
    if(character.posY < 0) {
       character.posY = 0; 
    }
    if(character.posX +32 > canvas.width) {
        character.posX = canvas.width - 32;
    }
    if(character.posY +32 > canvas.height) {
        character.posY = canvas.height -32;
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
// Der Code wird in einer geloopten Zeit aufgerufen//
init();
setInterval(gameLoop, 0);