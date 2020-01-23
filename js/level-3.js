//Variablen-Deklaration 
var canvas = document.getElementById("myCanvas"); //Canvas mit ID einlesen 
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

var bx = -30;
var by = 30;
var fx = 2
var fy = 0


var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; //2D Array wird erstellt
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
    
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
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

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        //alert("You Win, Congratulations!")
                        //document.location.reload();
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
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 50, 20);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Level 3", canvas.width/2, 20);
    ctx.textAlign = "center";
}

//Zeichnen der Hintergrundelemente
//Canvas: height="520" width="680"
function drawFishes() {
    var img = new Image();
    var img2 = new Image();
    var img3 = new Image();
    img.src="resources/level_3/fish-1.gif"
    img2.src="resources/level_3/fish-2.gif";
    img3.src="resources/level_3/fish-3.gif"; 
    ctx.drawImage(img, bx, by)
    ctx.drawImage(img2, bx-10, by+150, 150, 150) 
    ctx.drawImage(img3, bx+30, by+200) 
    
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

//Zeichnen der Bricks aus dem 2D Array
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
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
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    drawBricks();
    drawFishes();
    if(counter%1000 == 0) {
        bx = -300;
        by=0;
    }



    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //alert("GAME OVER");
            //document.location.reload();
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

    counter++;

}

var interval = setInterval(draw, 10); //Interval fuer das Zeichnen der Frames 