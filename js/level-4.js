let canvas = document.getElementById("level_4");
let ctx = canvas.getContext("2d");
let shipImg = document.getElementById("../resources/level_4/ship.png");
let shipWidth = 50;
let shipHeight = 20;
let shipX = 50;
let shipY = canvas.height / 2 - shipHeight / 2;
let shotWidth = 10;
let shotHeight = 2;
let shots = [];
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let brickWidth = 75;
let brickHeight = 20;
let shotsBricks = [];
let brickColumnCount = 4;
let brickRowCount = 4;
let score = 0;
let lives = 3;
let bricks = [];
let frameCount = 0;
let lastShot = 100000;
let lastShotBricks = -300;
let brickCount = 0;

for (let i = brickColumnCount; i > 0; i--) {
    brickCount += i;
}

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

draw();

function draw() {
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawShip();
    drawShotsShip();
    drawShotsBricks();
    collisionWithBricks();
    collisionWithShip();
    drawScore();
}

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
        if (shipX + shipWidth > canvas.width * 0.4) {
            shipX = canvas.width * 0.4 - shipWidth;
        }
    }
    if (spacePressed && lastShot > 30) {
        shots.push({
            x: shipX + shipWidth,
            y: shipY + shipHeight / 2 - shotHeight / 2,
            status: 1
        });
        lastShot = 0;
    }
    if (downPressed) {
        document.getElementById("spaceBack").play();
    }
    lastShot++;
    ctx.beginPath();
    ctx.rect(shipX, shipY, shipWidth, shipHeight);
    ctx.fillStyle = "#FFC717";
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
                if (lastShotBricks > 100) {
                    shotsBricks.push({
                        x: brickX,
                        y: brickY + shipHeight / 2 - shotHeight / 2,
                        status: 1
                    });
                    lastShotBricks = 0;
                }
                lastShotBricks++;
            }
        }
    }
}

function drawShotsShip() {
    for (let i = 0; i < shots.length; i++) {
        if (shots[i].status === 0) {
            continue;
        }
        shots[i].x = shots[i].x + 5;
        ctx.beginPath();
        ctx.rect(shots[i].x, shots[i].y, shotWidth, shotHeight);
        ctx.fillStyle = "#ff0db4";
        ctx.fill();
        ctx.closePath();
    }
}

function drawShotsBricks() {
    for (let i = 0; i < shotsBricks.length; i++) {
        if (shotsBricks[i].status === 0) {
            continue;
        }
        shotsBricks[i].x = shotsBricks[i].x - 3;
        ctx.beginPath();
        ctx.rect(shotsBricks[i].x, shotsBricks[i].y, shotWidth, shotHeight);
        ctx.fillStyle = "#ff0db4";
        ctx.fill();
        ctx.closePath();
    }
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
    if (e.key === "\ ") {
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
    if (e.key === "\ ") {
        spacePressed = false;
    }
}

function drawScore() {
    ctx.font = "20px Agency FB";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 50, 20);
    ctx.font = "20px Agency FB";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Die Wächter des Universums", canvas.width/2, 20);
    ctx.textAlign = "center";
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#008000";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function collisionWithBricks() {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row <= column; row++) {
            let b = bricks[column][row];
            if (b.status === 1) {
                for (let i = 0; i < shots.length; i++) {
                    let shot = shots[i];
                    if (shot.status === 0) {
                        continue;
                    }
                    if (shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y >= b.y && shot.y <= b.y + brickHeight || shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y + shotHeight >= b.y && shot.y + shotHeight <= b.y + brickHeight) {
                        b.status = 0;
                        shot.status = 0;
                        score += 10;
                        if (score === 10 * brickCount) {
                            setTimeout(function () {
//                                ctx.clearRect(0, 0, canvas.width, canvas.height);
//                                alert("You win");
//                                document.location.reload();
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                document.getElementById("level_complete").classList.add("visible");  
                                clearInterval(interval); // Needed for Chrome to end game
                            }, 10);
                        }
                    }
                }
            }
        }
    }
}

function collisionWithShip() {
    for (let i = 0; i < shotsBricks.length; i++) {
        let shot = shotsBricks[i];
        if (shot.x <= shipX + shipWidth && shot.x >= shipX && shot.y >= shipY && shot.y <= shipY + shipHeight/* || shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y + shotHeight >= b.y && shot.y + shotHeight <= b.y + brickHeight*/) {
            setTimeout(function () {
//                ctx.clearRect(0, 0, canvas.width, canvas.height);
//                alert("You lose");
//                document.location.reload();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.getElementById("game_over").classList.add("visible");  
                clearInterval(interval); // Needed for Chrome to end game
            }, 10);

        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(draw, 10);

//if (shipX >= b.x && shipX <= b.x + brickWidth && shipY >= b.y && shipY <= b.y + brickHeight || shipX + shipWidth >= b.x && shipX + shipWidth <= b.x + brickWidth && shipY >= b.y && shipY <= b.y + brickHeight || shipX >= b.x && shipX <= b.x + brickWidth && shipY + shipHeight >= b.y && shipY + shipHeight <= b.y + brickHeight || shipX + shipWidth >= b.x && shipX + shipWidth <= b.x + brickWidth && shipY + shipHeight >= b.y && shipY + shipHeight <= b.y + brickHeight) {
