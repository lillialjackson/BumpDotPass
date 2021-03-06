//  var
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 5;
var ballSpeedY = 4;

var playerLeftScore = 0;
var playerRightScore = 0;
const winningScore = 7;

var showingWinScreen = false;

var paddleLeftY = 250;
var paddleRightY = 250;
const paddleWidth = 10;
const paddleHeight = 100;

// mouse position
function calculateMousePos (evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX -rect.left - root.scrollLeft;
  var mouseY = evt.clientY -rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }

}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    playerLeftScore = 0;
    playerRightScore = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function(){
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('click', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt){
    var mousePos = calculateMousePos(evt);
    paddleLeftY = mousePos.y - (paddleHeight/2);
  });
}


// can be used in place on inline if it will be used again
// function callBoth() {
//   moveEverything();
//   drawEverything();
// }


// reset ball after score
function ballReset() {
  if(playerLeftScore >= winningScore || playerRightScore >= winningScore) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}
// computer paddle
function computerMovement() {
  var paddleRightYCenter = paddleRightY + (paddleHeight/2);
  if(paddleRightYCenter < ballY - 30) {
    paddleRightY += 10;
  } else if(paddleRightYCenter > ballY + 30)  {
    paddleRightY -= 10;
  }

}
//  move paddles
function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if(ballX < 0) {
    if(ballY > paddleLeftY && ballY < paddleLeftY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddleLeftY + paddleHeight/2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerRightScore ++;
      ballReset();

    }
  }
  if(ballX > canvas.width) {
    if(ballY > paddleRightY && ballY < paddleRightY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddleRightY + paddleHeight/2);
    } else {
      // increment score prior to ballReset for winning check
      playerLeftScore ++;
      ballReset();

    }
  }
  if(ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if(ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

}
// draw net
function drawNet(){
  for (var i = 0; i < canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  // background
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  // win screen
  if(showingWinScreen) {
    canvasContext.fillStyle = 'green';
    if(playerLeftScore >= winningScore){
      canvasContext.fillText('You Won!!!!', 350, 200);
    } else if (playerRightScore >= winningScore) {
      canvasContext.fillText('Better Luck Next Time...', 350, 200);
    }
    canvasContext.fillText('click to continue', 350, 500);
    return;
  }
  // net
  drawNet();
  // paddle left
  colorRect(0,paddleLeftY,paddleWidth,paddleHeight, 'white');
  //  paddle right
  colorRect(canvas.width - paddleWidth,paddleRightY,paddleWidth,100, 'white');
  // ball
  colorCircle(ballX, ballY, 10, 'green');
  // score
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(playerLeftScore, 100, 100);
  canvasContext.fillText(playerRightScore, canvas.width - 100, 100);


}
// draw paddles, table, net
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}
// draw ball
function colorCircle (centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
