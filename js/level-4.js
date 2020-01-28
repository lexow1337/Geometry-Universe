let canvas = document.getElementById("level_4");
let ctx = canvas.getContext("2d");
//let shipImg = document.getElementById("../resources/level_4/ship.png");
//height, width, X und Y position of game character
let shipWidth = 50;
let shipHeight = 20;
let shipX = 50;
let shipY = canvas.height / 2 - shipHeight / 2;
//shot height and width
let shotWidth = 10;
let shotHeight = 2;
//array for ship (playable character) shots
let shots = [];
//booleans for key strokes
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
//width and height of enemies
let brickWidth = 75;
let brickHeight = 20;
//array for shots enemies
let shotsBricks = [];
//brick and row count for enemies
let brickColumnCount = 4;
let brickRowCount = 4;
//Array for enemies
let bricks = [];
//Score
let score = 0;
//time between shots of ship
let lastShot = 100000;
//time between shots of enemies
let lastShotBricks = -300;
//number of enemies
let brickCount = 0;
//enemies getting counted
for (let i = brickColumnCount; i > 0; i--) {
    brickCount += i;
}

//initializing Array for enemies
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

draw();

//main function, starts all the other functions
function draw() {
    //clears the canvas every time it's drawn
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
    //moves the ship up when pressed 'w'
    if (upPressed) {
        shipY -= 3;
        if (shipY < 0) {
            shipY = 0;
        }
    //moves the ship down when pressed 's'
    } else if (downPressed) {
        shipY += 3;
        if (shipY + shipHeight > canvas.height) {
            shipY = canvas.height - shipHeight;
        }
    }
    //moves the ship left when pressed 'a'
    if (leftPressed) {
        shipX -= 3;
        if (shipX < 0) {
            shipX = 0;
        }
    //moves the ship right when pressed 'd'
    } else if (rightPressed) {
        shipX += 3;
        if (shipX + shipWidth > canvas.width * 0.4) {
            shipX = canvas.width * 0.4 - shipWidth;
        }
    }
    //ship shoots when pressed space; 30 ist the time between two shots in (30 --> 3 ms)
    if (spacePressed && lastShot > 30) {
        //pushes new shots into shot array
        shots.push({
            //sets x and y values for ship
            x: shipX + shipWidth,
            y: shipY + shipHeight / 2 - shotHeight / 2,
            //sets status to 'visible'
            status: 1
        });
        //resets lastShot after every shot
        lastShot = 0;
    }
    if (downPressed || rightPressed || leftPressed || upPressed || spacePressed) {
    //starts playing background music
        document.getElementById("spaceBack").play();
    }
    //increases lastShot number, to build up next shot
    lastShot++;
    //draws ship
    ctx.beginPath();
    ctx.rect(shipX, shipY, shipWidth, shipHeight);
    ctx.fillStyle = "#FFC717";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    //iterates through array to draw enemies in each position
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row <= column; row++) {
            //checks if enemy is drawn
            if (bricks[column][row].status === 1) {
                //initializes position for enemies; formula for triangle shape
                let brickX = canvas.width * ((column + 4) / 8);
                let brickY = canvas.height * ((row + 1) / (column + 2)) - brickHeight / 2;
                //sets x and y position
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                //draws enemies
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ff4262";
                ctx.fill();
                ctx.closePath();
                //enemies shoots; 100 ist the time between two shots in (100 --> 10 ms)
                if (lastShotBricks > 100) {
                    shotsBricks.push({
                        //x and y starting points for enemy shots
                        x: brickX,
                        y: brickY + shipHeight / 2 - shotHeight / 2,
                        status: 1
                    });
                    //resets shot timer
                    lastShotBricks = 0;
                }
                //increases lastShot number, to build up next shot
                lastShotBricks++;
            }
        }
    }
}

function drawShotsShip() {
    //iterates through shots Array
    for (let i = 0; i < shots.length; i++) {
        if (shots[i].status === 0) {
            continue;
        }
        //draws shots of ship; 5 is for speed
        shots[i].x = shots[i].x + 5;
        ctx.beginPath();
        ctx.rect(shots[i].x, shots[i].y, shotWidth, shotHeight);
        ctx.fillStyle = "#ff0db4";
        ctx.fill();
        ctx.closePath();
    }
}

function drawShotsBricks() {
    //iterates through array for enemy shots
    for (let i = 0; i < shotsBricks.length; i++) {
        if (shotsBricks[i].status === 0) {
            //if there is no brick it skips the rest of 'for'
            continue;
        }
        //draws shot of enemies; 3 is for speed
        shotsBricks[i].x = shotsBricks[i].x - 3;
        ctx.beginPath();
        ctx.rect(shotsBricks[i].x, shotsBricks[i].y, shotWidth, shotHeight);
        ctx.fillStyle = "#ff0db4";
        ctx.fill();
        ctx.closePath();
    }
}

//recognized the key pressed and sets boolean to true
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
//when the key is released sets boolean to false
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

//draws Score and level title
function drawScore() {
    //sets font, font-size, colour and position
    ctx.font = "20px Agency FB";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 50, 20);
    ctx.font = "20px Agency FB";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Die Wächter des Universums", canvas.width/2, 20);
    ctx.textAlign = "center";
}

//collision detection shipShot and enemy
function collisionWithBricks() {
    //iterates through enemies array and compares every enemies position with shot (of ship) position
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row <= column; row++) {
            //variable for comfort and less writing
            let b = bricks[column][row];
            //only detects collision if the enemies brick is drawn
            if (b.status === 1) {
                for (let i = 0; i < shots.length; i++) {
                    //variable for comfort and less writing
                    let shot = shots[i];
                    // if the shots isn't drawn skip the rest of the loop
                    if (shot.status === 0) {
                        continue;
                    }
                    //compares the position of the two right corners of the shot with the enemies position
                    if (shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y >= b.y && shot.y <= b.y + brickHeight || shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y + shotHeight >= b.y && shot.y + shotHeight <= b.y + brickHeight) {
                        //if hit erases shot and enemy and increases score
                        b.status = 0;
                        shot.status = 0;
                        score += 10;
                        //if all enemies are defeated show 'level complete' screen
                        if (score === 10 * brickCount) {
                            setTimeout(function () {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                document.getElementById("level_complete").classList.add("visible");  
                                clearInterval(interval); // Needed for Chrome to end game
                            });
                        }
                    }
                }
            }
        }
    }
}

//collision detection enemy shots and ship
function collisionWithShip() {
    //iterates through enemies shot array and compares every shots position with ship position
    for (let i = 0; i < shotsBricks.length; i++) {
        //variable for comfort and less writing
        let shot = shotsBricks[i];
        //compares the position of the two left corners of the enemies shot with the ships position
        if (shot.x <= shipX + shipWidth && shot.x >= shipX && shot.y >= shipY && shot.y <= shipY + shipHeight/* || shot.x + shotWidth >= b.x && shot.x + shotWidth <= b.x + brickWidth && shot.y + shotHeight >= b.y && shot.y + shotHeight <= b.y + brickHeight*/) {
            //game over screen if ship is hit
            setTimeout(function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.getElementById("game_over").classList.add("visible");
                // Needed for Chrome to end game
                clearInterval(interval);
            });

        }
    }
}

//recognizes when key is pressed and unpressed
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//repaints the frame every 10ms
setInterval(draw, 10);