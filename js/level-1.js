var myGamePiece;
var myObstacles = [];
var myScore;
var myDistance;
var bx = 100;	
var by = 100;
//var ctx = myGameArea.context;
//Defifintion Funktion//

function startGame() {
    //myGamePiece = new component(30, 30, "Yellow", 10, 120);
	myGamePiece = new component( 30, 30, "resources/level_1/Figur5.png", 10, 120, "image");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
    myGameArea.start();
}


/*Canvas für das Spiel
Wie groß soll das Spielfeld sein
Wie kann ich den auf vollen Bildschirm setzen?*/

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 924; //Ändern und funktionen etc angleichen 480
        this.canvas.height = 520; //270
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	
	}
   


function component(width, height, color, x, y, type) {
    this.type = type;
		if (type == "image"){
			this.image = new Image();
			this.image.src = color; 
		}
			
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
            ctx = myGameArea.context;
        if (this.type == "text") {
			ctx.font = "50px Agency FB";
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
		
		
		if (type == "image"){
			ctx.drawImage(this.image,
						  this.x, 
						  this.y, 
						  this.width,
						  this.height);
		}
		
		else{
			ctx.fillStyle = color; 
			ctx.fillRect(this.x, this.y, this.width, this.height);
		
		}
		
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
		
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
	
	//for (l=0; l <= 10000; l++){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) { 
        if (myGamePiece.crashWith(myObstacles[i])) {
			//könnte fehler machen 
			alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); 
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 2;
	myDistance = 12000 - myGameArea.frameNo;
	drawFishes();
	
	if (myDistance == 0){
			alert("Sie haben Ihr Ziel Erreicht");
            document.location.reload();
            clearInterval(interval); 
            return;
        } 
	
	
	if (numberIntervals(9700)){
			if (everyinterval(150)) {
			x = myGameArea.canvas.width;
			minHeight = 0;
			maxHeight = 500;
			height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			minGap = 75;
			maxGap = 75;
			gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			myObstacles.push(new component(30, height, "#6A6A4A", x, 0));
			myObstacles.push(new component(30, x - height - gap, "#6A6A4A", x, height + gap));
			
		}	

		for (i = 0; i < myObstacles.length; i += 1) {
			myObstacles[i].x += -1.7;
			myObstacles[i].update();
			}
		updates();
		move();
		}
	
	
	if (numberIntervals(9200)){
		
		if (everyinterval(150)) {
			x = myGameArea.canvas.width;
			/*
			minHeight = 100;
			maxHeight = 180;
			height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			minGap = 75;
			maxGap = 100;
			gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			myObstacles.push(new component(30, height, "#6A6A4A", x, 0));
			myObstacles.push(new component(30, x - height - gap, "#6A6A4A", x, height + gap));
			*/
		}	
		

		for (i = 0; i < myObstacles.length; i += 1) {
			myObstacles[i].x += -2.5;
			myObstacles[i].update();
			}
		updates();
		move();
		}
	
	
		else{

			if (numberIntervals(6000)){

				if (everyinterval(150)) {
					x = myGameArea.canvas.width;
					minHeight = 10;
					maxHeight = 300;
					height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
					minGap = 75;
					maxGap = 100;
					gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
					myObstacles.push(new component(30, height, "#4A4A4A", x, 0));
					myObstacles.push(new component(30, x - height - gap, "#4A4A4A", x, height + gap));

				}
				//}

				for (i = 0; i < myObstacles.length; i += 1) {
					myObstacles[i].x += -2;
					myObstacles[i].update();
				}
				updates();
				move();



		}
	
							else {

							if (numberIntervals(2400)){


								if (myGameArea.frameNo == 1 || everyinterval(150)) {
									x = myGameArea.canvas.width;
									minHeight = 10;
									maxHeight = 300;
									height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
									minGap = 100;
									maxGap = 125;
									gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
									myObstacles.push(new component(30, height, "#2F2F2F", x, 0));
									myObstacles.push(new component(30, x - height - gap, "#2F2F2F", x, height + gap));
									}

									for (i = 0; i < myObstacles.length; i += 1) {
										myObstacles[i].x += -3;
										myObstacles[i].update();
									}

							
								updates();
								move();
							
							}

//	}
											else {

											if (numberIntervals(1200)){
												if (myGameArea.frameNo == 1 || everyinterval(150)) {
												x = myGameArea.canvas.width;
												}

																					}
													else{

														if (myGameArea.frameNo == 1 || everyinterval(150)) {
															x = myGameArea.canvas.width;
															minHeight = 130;
															maxHeight = 180;
															height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
															minGap = 90;
															maxGap = 100;
															gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
															myObstacles.push(new component(150, height, "#2F2F2F", x, 0));
															myObstacles.push(new component(150, x - height - gap, "#2F2F2F", x, height + gap));
														}
														}




														for (i = 0; i < myObstacles.length; i += 1) {
															myObstacles[i].x += -1;
															myObstacles[i].update();
														}
											
														updates();
														move();
														
													
												}
				}
		}		
}

function updates(){
	myScore.text="Höhle des Majritji " + myDistance + " m";
	myScore.update();
	myGamePiece.newPos();
	myGamePiece.update();
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;    
	}
											
	
	
function move(){
	
	if (myGameArea.keys && myGameArea.keys[37]) {
			myGamePiece.speedX = -1.5; myGamePiece.gravity = 0
	}

	if (myGameArea.keys && myGameArea.keys[39]) {
			myGamePiece.speedX = 1.5; myGamePiece.gravity = 0
	}

	if (myGameArea.keys && myGameArea.keys[38]) {
			myGamePiece.speedY = -1.5;myGamePiece.gravity = 0
	}

	if (myGameArea.keys && myGameArea.keys[40]) {
			myGamePiece.speedY = 1.5;myGamePiece.gravity = 0 
	}
	
	myGamePiece.newPos();    
	myGamePiece.update();
	
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
		return true;
	}
    return false;
}

function numberIntervals(c){
	if ((myGameArea.frameNo >= c)){
		return true;
	}
	return false; 
}

function noKeydown(){
	if (myGameArea.keys){
		return false;
	}
	return true;
}


/*
function draw() {
  
drawFishes();
//this.gravity = 1.002;

 //   console.log(updateGameArea);
}
*/


function drawFishes() {
    var img = new Image();
	
    //var img2 = new Image();
    //var img3 = new Image();
    img.src= "resources/level_1/AnimationPS.gif";
   // img2.src="resources/level_3/fish-2.gif";
   // img3.src="resources/level_3/fish-3.gif"; 
	ctx = myGameArea.context;
    //
	ctx.drawImage(img, bx, by);
	//img.gravity = 2.01; 
   // ctx.drawImage(img2, bx-10, by+150, 150, 150);
   // ctx.drawImage(img3, bx+30, by+200);
//	var id = setInterval(myGameArea.frameNo, 150);
	var id = setInterval(frame, 20);
	
	//img.gravity = 2
	//var id = setInterval(interval);
	//var id = setInterval(updateGameArea);
	/*var pos = bx + by;
	
	 function frame() {
		if (pos == 350) {
		  clearInterval(id);
		} else {
		  pos ++; 
		  img.style.top = pos + 'px'; 
		  img.style.left = pos + 'px'; 
		}
	  }
	  */
	
	
	 function frame() {
		 
		
		if (bx == 0 || by == 0) {
		  clearInterval(id);
		} 
		 
		 else {
		
		  bx -1;
		  by - 1; 
			
		 // img.style.top = bx; 
		 // img.style.left = by; 
		  
		}
	  }
	  
}

/*

function myMove() {
  var elem = document.getElementById("myAnimation");   
  var pos = 0;
  var id = setInterval(frame, 10);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++; 
      elem.style.top = pos + 'px'; 
      elem.style.left = pos + 'px'; 
    }
	
	
  }
  */