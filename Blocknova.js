//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 100; //80 normal
let playerHeight = 10;
let playerVelocityX = 10;


let player = {
    x : boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 30,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}


//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 4; //4 normal
let ballVelocityY = 2;  //2 normal

let ball = {
    x : boardWidth/6,
    y : boardHeight/4,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY

}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 15;
let blockY = 29;

let score = 0;
let gameOver = false;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //player
    context.fillStyle = "#edc638";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    
   //create blocks
   createBlocks();
}

function update(){ 
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }



    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "#edc638";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

      //bounce
    if (ball.y <=0){

        ball.velocityY *= -1;
    }
    
    else if(ball.x <= 0 || (ball.x + ball.width ) >= boardWidth) {

        ball.velocityX *= -1;
    }
    else if(ball.y + ball.height >= boardHeight){
        context.font = "20px Segoe-UI-Semibold";
        context.fillText("Game Over: Press 'Space' to Restart", 110 ,400);
        gameOver = true;
    }

    //bounce in player
    if (topCollision(ball, player) || bottomCollision(ball,player) ){
        ball.velocityY *= -1;

    } 
    else if (leftCollision(ball, player) || rightCollision(ball, player)){
        ball.velocityX *= -1;
    }

    //blocks
    context.fillStyle = "#DA6138";
    for (let i=0; i<blockArray.length; i++){
        let block =blockArray [i];
        if (!block.break){
            if (topCollision(ball, block)|| bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY *= -1;
                blockCount-=1;
                score += 100;
            }
            else if (leftCollision(ball, block)|| rightCollision(ball, block)){
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                 score += 100;
            }

            context.fillRect(block.x, block.y, block.width, block.height);
        }

    }
        //next lvl
        if (blockCount == 0){
            score += 100*blockRows*blockColumns;    //points
            blockRows = Math.min(blockRows + 1, blockMaxRows);
            createBlocks();
        }



    context.font = "23px Source-sans-Pro-Black";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);



}

function movePlayer(e){
    if (gameOver){
        if (e.code == "Space"){
            resetGame();
        }
    }




    if (e.code == "ArrowLeft"){
        //player.x -= player.velocityX;
        let nextplayerX = player.x - player.velocityX;
        if (!outOfBounds(nextplayerX)){
            player.x = nextplayerX;
        }        

    }
    else if (e.code == "ArrowRight") {
       // player.x += player.velocityX;
let nextplayerX = player.x + player.velocityX;
        if (!outOfBounds(nextplayerX)){
            player.x = nextplayerX;
        }   

    }

}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;


}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block){
    return detectCollision (ball, block) && (block.y + block.height) >= ball.y;

}

function leftCollision(ball, block){
    return detectCollision(ball, block) && (ball.x + ball.width)>= block.x; 

}

function rightCollision(ball, block){
 return detectCollision(ball, block) && (block.x  + block.width) >= ball.x;

}

function createBlocks(){
    blockArray =[];
    for (let c =0; c < blockColumns; c++){
        for (let r = 0; r<blockRows; r++ ){
            let block = {
                x : blockX + c*blockWidth + c*10,
                y : blockY + r*blockHeight + r*10,
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);



        }

    }
    blockCount = blockArray.length;
}

function resetGame(){
    gameOver = false

    player = {
    x : boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 30,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}
    ball = {
    x : boardWidth/6,
    y : boardHeight/4,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY

}

    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();


}