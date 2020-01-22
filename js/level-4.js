let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let shipWidth = 50;
let shipHeight = 20;
let shipX = 50;
let shipY = canvas.height / 2 - shipHeight / 2;
let shotWidth = 10;
let shotHeight = 2;
let shotX = shipX + shipWidth;
let shotY = shipY + shipHeight / 2 - shotHeight / 2;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let brickWidth = 75;
let brickHeight = 20;
let brickColumnCount = 4;
//let shipImg = new Image();
//let dx = shipX - brickX;
//let dy = shipY - brickY;
let score = 0;
let lives = 3;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < 4; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

draw();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //init();
    drawShip();
    drawBricks();
    collisionDetection();
    drawLives();
    drawScore();
}

/*function init(){
    shipImg.src = 'ship.png';
}*/

function drawShip() {
    if (upPressed) {
        shipY -= 3;
        if (shipY < 0) {
            shipY = 0;
        }
    } else if (downPressed) {
        shipY += 3;
        if (shipY + shipHeight > canvas.height) {
            shipY = canvas.height - shipHeight;
        }
    }
    if (leftPressed) {
        shipX -= 3;
        if (shipX < 0) {
            shipX = 0;
        }
    } else if (rightPressed) {
        shipX += 3;
        if (shipX + shipWidth > canvas.width /** 0.4*/) {
            shipX = canvas.width /** 0.4 */- shipWidth;
        }
    }
    if(spacePressed){
        drawShot();
    }
    ctx.beginPath();
    ctx.rect(shipX, shipY, shipWidth, shipHeight);
    ctx.fillStyle = "#307dff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row <= column; row++) {
            if (bricks[column][row].status === 1) {
                let brickX = canvas.width * ((column + 4) / 8);
                let brickY = canvas.height * ((row + 1) / (column + 2)) - brickHeight / 2;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ff4262";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawShot(){
    shotX = shipX + shipWidth;
    shotY = shipY + shipHeight / 2 - shotHeight / 2;
    ctx.beginPath();
    ctx.rect(shotX, shotY, shotWidth, shotHeight);
    ctx.fillStyle = "#ff0db4";
    ctx.fill();
    ctx.closePath();
    shotX += 3;
}

function keyDownHandler(e) {
    if (e.key === "\w" || e.key === "\W") {
        upPressed = true;
    } else if (e.key === "\s" || e.key === "\S") {
        downPressed = true;
    }
    if (e.key === "\a" || e.key === "\A") {
        leftPressed = true;
    } else if (e.key === "\d" || e.key === "\D") {
        rightPressed = true;
    }
    if(e.key === "\ "){
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "\w" || e.key === "\W") {
        upPressed = false;
    } else if (e.key === "\s" || e.key === "\S") {
        downPressed = false;
    }
    if (e.key === "\a" || e.key === "\A") {
        leftPressed = false;
    } else if (e.key === "\d" || e.key === "\D") {
        rightPressed = false;
    }
    if(e.key === "\ "){
        spacePressed = false;
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#008000";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#008000";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function collisionDetection() {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row <= column; row++) {
            let b = bricks[column][row];
            if (b.status === 1) {
                //if (shipX >= b.x && shipX <= b.x + brickWidth && shipY >= b.y && shipY <= b.y + brickHeight || shipX + shipWidth >= b.x && shipX + shipWidth <= b.x + brickWidth && shipY >= b.y && shipY <= b.y + brickHeight || shipX >= b.x && shipX <= b.x + brickWidth && shipY + shipHeight >= b.y && shipY + shipHeight <= b.y + brickHeight || shipX + shipWidth >= b.x && shipX + shipWidth <= b.x + brickWidth && shipY + shipHeight >= b.y && shipY + shipHeight <= b.y + brickHeight) {
                if (shotX + shotWidth >= b.x && shotX + shotWidth <= b.x + brickWidth && shotY >= b.y && shotY <= b.y + brickHeight || shotX + shotWidth >= b.x && shotX + shotWidth <= b.x + brickWidth && shotY + shotHeight >= b.y && shotY + shotHeight <= b.y + brickHeight) {
                    //dy = -1.05 * dy;
                    b.status = 0;
                    //score += 5;
                    /*if (score === 30) {
                        alert(score + " Points. You win!");
                        document.location.reload();
                    }*/
                }
            }
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(draw, 10);



/*if (shipX < brickX + brickWidth &&
shipX + shipWidth > brickX &&
shipY < brickY + brickHeight &&
shipY + shipHeight > brickY
)
{
    ctx.fillStyle = "#ff4262";
}
else
{
    ctx.fillStyle = "#307dff";
}*/