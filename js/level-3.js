//Variablen-Deklaration 
var canvas = document.getElementById("level_3"); //Canvas mit ID einlesen 
var ctx = canvas.getContext("2d"); //Canvas Render Context = 2D -> hiermit wird spaeter auf auf dem Canvas gezeichnet 
var ballRadius = 10; 
var x = canvas.width/2;
var y = canvas.height-50;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 60;
var brickOffsetLeft = 250;

var score = 0; 

//Richtungsvariablen der Fische
//bx und by Startposition
var bx = -30;
var by = 30;
var fx = 2
var fy = 0

//Audio files
var soundtrack = new Audio('resources/level_3/Underwater-Sound.mp3');
var impact1 = new Audio('resources/level_3/impact1.mp3');
var impact2 = new Audio('resources/level_3/impact2.mp3');

//Initialisieren des brick Arrays
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; 
    }
}

//Event keydown/up triggert key...Hanlder functions
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
    
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        soundtrack.play();
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        soundtrack.play();
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//Kollision wenn position des Balls 
function collisionDetection() {
    //Bricks Iterieren
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                //Wenn Ball sich an Pos eines Bricks befindet
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    //Richtung des Balls aendern
                    dy = -dy;
                    //Brick entfernen
                    b.status = 0;
                    impact1.play();
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        document.getElementById("level_complete").classList.add("visible"); 
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

//Zeichnen des Scoreboards
function drawScore() {
    ctx.font = "20px Agency FB";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: "+score, 50, 20);
    ctx.font = "20px Ageny FB";
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Die Untiefen von Birniemar", canvas.width/2, 20);
    ctx.textAlign = "center";
}

//Zeichnen der Fische
function drawFishes() {
    var img = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var img5 = new Image();
    var img6 = new Image();
    
    img.src="resources/level_3/fish-1.gif"
    img2.src="resources/level_3/fish-2.gif";
    img3.src="resources/level_3/fish-3.gif"; 
    img4.src="resources/level_3/fish-4.gif"
    img5.src="resources/level_3/fish-5.gif";
    img6.src="resources/level_3/fish-6.gif"; 
    
    ctx.drawImage(img, bx, by)
    ctx.drawImage(img2, bx-10, by+150, 150, 150) 
    ctx.drawImage(img3, bx+30, by+200) 
    
    ctx.drawImage(img, bx-580, by+150)
    ctx.drawImage(img5, bx-620, by+350, 150, 150) 
    
    ctx.drawImage(img4, bx-1030, by+60, 200, 200)
    ctx.drawImage(img5, bx-1070, by+260) 
    ctx.drawImage(img6, bx-1000, by+230, 150, 150) 
    
}

function drawBackground() {
    var img4 = new Image();
    img4.src="resources/level_3/background.jpg";
    ctx.drawImage(img4, 0, 0) 
}

//Zeichnung des Spielballs
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); //arc fuer Zeichnen eines Kreises
    ctx.fillStyle = "#FF8591";
    ctx.fill();
    ctx.closePath();
}

//Zeichnen des Schlaegers
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); //rect fuer Zeichnen eines Rechtecks
    ctx.fillStyle = "#1D3140";
    ctx.fill();
    ctx.closePath();
}

//Zeichnen der Bricks
function drawBricks() {
    //Iterieren der Spalten im Aufbau der Bricks
    for(var c=0; c<brickColumnCount; c++) {
        //Iterieren der Zeilen
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                //Zeichnen eines Bricks
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var counter = 0;
//Function wird alle 10 ms ausgefuert
function draw() {
    //Aufruf der functions zum zeichnen im canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    drawBricks();
    drawFishes();
    
    //Richtungsvariable der Fische wird alle 12 Sek. zurueckgesetzt
    if(counter%1200 == 0) {
        bx = -300;
        by=0;
    }



    // Wenn der Ball den Spielfeldrand berührt, soll der Ball seine Richtung aendern und ein Sound wird abgespielt
    // Die Variable dx gibt die Richtung des Spielball an
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        impact2.play();
    }
    if(y + dy < ballRadius) {
        dy = -dy;
        impact2.play();
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            impact2.play();
        }
        
        //Wenn der Ball den unteren Teil des Spielfeldrandes beruehrt, wird der Game Over Screen eingeblendet
        //Der Inhalt des Canvas wird entfernt sowie die variable interval zurueckgesetzt wird
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById("game_over").classList.add("visible");  
            clearInterval(interval); // Needed for Chrome to end game
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    //Ball x & y
    x += dx;
    y += dy;

    //Koordinaten der Fischbewegung x & y
    bx += fx;
    by += fy;
    
    //Fuer zeichnen der Fische 
    counter++;

}

var interval = setInterval(draw, 10); //Interval fuer das Zeichnen der Frames im 10 ms takt 