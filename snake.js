// instances canvas, snake, apple and canvasContext
const canvas = document.getElementById('canvas')

const canvasContext = canvas.getContext('2d');

let gameSpeed = 10
//connect to canvas using 'gameSpeed'
let gameSpeedElement = document.getElementById('gameSpeed')

// connect to canvas using 'highScore'
let highScore = 0 
let highScoreElement = document.getElementById('highScore')

let averageScore = 0
let averageScoreElement = document.getElementById('averageScore')

let epochNumber = 0
let epochNumberElement = document.getElementById('epochNumber')

gameSpeedElement.addEventListener('change', () =>{
    gameSpeed = parseInt(gameSpeedElement.textContent)
})

//work game
window.onload = () => {
    gameLoop();
}

function gameLoop(){
    setInterval(show, 1000/gameSpeed) // fps
}

function show(){
    update();
    draw();
}

//update each lopp
function update(){
    canvasContext.clearRect(0,0, canvas.width, canvas.height)
    console.log('update buddy')

    snake.move();
    eatApple();
    checkCollision();
}

function gameOver(){
    highScore = Math.max(highScore, snake.tail.length - 1)
    highScoreElement.textContent = highScore
    epochNumberElement.textContent = epochNumber++
    averageScoreElement.textContent = (parseInt(averageScoreElement.textContent) * epochNumber + snake.tail.length - 1) / epochNumber;

    snake.initVars()
}


function checkCollision(){
    let headTail = snake.tail[snake.tail.length - 1]

    //wall collision
    if( headTail.x <= -snake.size || headTail.x >= canvas.width ||
        headTail.y <= -snake.size || headTail.y >= canvas.height){
            gameOver()
            return
        }
    
    //self collision
    for(let i=0; i<snake.tail.length - 2; i++){
        if(headTail.x == snake.tail[i].x && headTail.y == snake.tail[i].y){
            gameOver()
            return
        }
    }

    /* appear up down left and right
    if(headTail.x == - snake.size){
        headTail.x = canvas.width - snake.size
    }else if(headTail.x == canvas.width){
        headTail.x = 0
    }else if(headTail.y == - snake.size){
        headTail.y = canvas.height - snake.size
    }else if(headTail.y == canvas.height){
        headTail.y = 0
    }*/
}


function eatApple(){
    if(snake.tail[snake.tail.length - 1].x == apple.x && snake.tail[snake.tail.length - 1].y == apple.y){
        snake.tail[snake.tail.length] = {x:apple.x, y: apple.y}
        apple = new Apple();        
    }
}

//show in canvas
function draw(){
    createRect(0,0,canvas.width, canvas.height, 'green')
    createRect(0,0,canvas.width, canvas.height)
    for(var i=0; i<snake.tail.length; i++){
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size - 5, 'white')
    }

    canvasContext.font = '20px Arial'
    canvasContext.fillStyle = '#00FF42'
    canvasContext.fillText('Score: ' + (snake.tail.length - 1), canvas.width - 120, 18);
    //show apple
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
}


//create object in canvas
function createRect(x,y,width,height, color){
    canvasContext.fillStyle = color
    canvasContext.fillRect(x,y,width,height)
}


//move with keyboards
window.addEventListener('keydown', (event)=>{
    setTimeout(()=>{
        if(event.keyCode == 37 && snake.rotateX != 1){
            snake.rotateX = -1
            snake.rotateY = 0
        }else if(event.keyCode == 38 && snake.rotateY != 1){
            snake.rotateX = 0
            snake.rotateY = -1
        }else if(event.keyCode == 39 && snake.rotateX != -1){
            snake.rotateX = 1
            snake.rotateY = 0
        }else if(event.keyCode == 40 && snake.rotateY != -1){
            snake.rotateX = 0
            snake.rotateY = 1
        }
    }, 1)
})



class Snake{

    constructor(){
        this.initVars();
    }

    initVars(){
        this.x = 20;
        this.y = 180;
        this.size = 20;
        this.tail = [{x: this.x, y: this.y}];
        this.rotateX = 0;
        this.rotateY = 1;
    }

    move(){
        let newRect;
        if(this.rotateX == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if(this.rotateX == - 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }else if(this.rotateY == 1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        }
        else if(this.rotateY == -1){
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)

    }
}


class Apple{
    constructor(){
        console.log('apple')
        let isTouching;
        while(true){
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            for(let i=0; i<snake.tail.length; i++){
                if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
                    isTouching = true
                }
            }
            if(!isTouching){
                break;
            }
            
        }
        this.color = 'red'
        this.size = snake.size
        console.log(this.x, this.y)
    }
}


const snake = new Snake();
let apple = new Apple();