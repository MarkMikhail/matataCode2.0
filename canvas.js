const canvas = document.getElementById("myCanvas");
const cn = canvas.getContext("2d");



var order = "";

var drawInt; // Interval variable
var i = 0; // Delay variable

const grid_width = 5;
const scale = canvas.width/grid_width;
const start_pos = [scale*(1-0.5), scale*(4-0.5)];

const fps = 25;
const orderSpeed = 2;

function setup(){
    // Styling and clearing the canvas
    cn.strokeStyle = 'orange';
    cn.lineWidth = 10;
    cn.lineCap = "round";
    cn.clearRect(0, 0, canvas.width, canvas.height);

    // Initialising position variables
    targetX = currX = start_pos[0];
    targetR = currR = 0;
    targetY = currY = start_pos[1];

    cn.beginPath();
    cn.moveTo(currX, currY);

    orderIndex = 0;
    isOrderDone = true;
    i = 0;
}

// Initialising position variables
var targetX = currX = start_pos[0];
var targetY = currY = start_pos[1];
var targetR = currR = 0;

var multiple;

var orderIndex = 0;
var isOrderDone = true;

var moveX, moveY, moveR;
var errorX, errorY, errorR;

const image = new Image();
image.src = 'mazes/maze1.png';
image.onload = function(){
    console.log("image loaded");
}

const boardCanvas = {
    canvas: document.getElementById("myCanvas"),

    setup: function(){
        this.canvas.width = 800;
        this.canvas.height = 640;
        this.context = this.canvas.getContext("2d");
    },

    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    start: function(){
        this.interval = setInterval(updateBoardArea, 20);
        // updateBoardArea();
    },

    grid: {
        scale: 100,
        set: function(columns){
            this.scale = boardCanvas.canvas.width/columns;
        },
        getx: function(column){
            return (column-0.5)*this.scale;
        },
        gety: function(row){
            return (row-0.5)*this.scale;
        }
    }
}

function startBoard(){

    order = [];
    boardCanvas.setup();
    boardCanvas.grid.set(5);

    myRobot = new robot(boardCanvas.grid.getx(1), boardCanvas.grid.gety(4), 0);
    background = new Image();
    background.src = 'mazes/maze1.png';
    background.onload = function(){
        boardCanvas.start();
    }
}

function robot(X, Y, R, color = 'orange', ) {
    this.x = X;
    this.y = Y;
    this.r = R;
    this.color = color;

    penLine = new Path2D();
    penLine.moveTo(this.x, this.y);

    this.update = function(){
        ctx = boardCanvas.context;

        size = boardCanvas.grid.scale*0.4;
        radius = Math.sqrt(Math.pow(size/2,2)*2);
        
        triangle = new Path2D();
        triangle.moveTo(this.x+radius*Math.sin(this.r),this.y-radius*Math.cos(this.r));
        triangle.lineTo(this.x+radius*Math.sin(this.r+(2*Math.PI/3)),this.y-radius*Math.cos(this.r+(2*Math.PI/3)));
        triangle.lineTo(this.x+radius*Math.sin(this.r+(4*Math.PI/3)),this.y-radius*Math.cos(this.r+(4*Math.PI/3)));

        circle = new Path2D();
        circle.arc(this.x, this.y, radius, 0, 2 * Math.PI);

        ctx.fillStyle = 'white';
        ctx.fill(circle);
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.color;
        ctx.stroke(circle);
        ctx.fillStyle = this.color;
        ctx.fill(triangle);
    }

    this.pen = function(){
        penLine.lineTo(this.x, this.y);

        ctx = boardCanvas.context;
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.color;
        ctx.stroke(penLine);
    }
}

function updateBoardArea(){

    boardCanvas.clear();
    
    boardCanvas.context.drawImage(background, 0, 0, boardCanvas.canvas.width, boardCanvas.canvas.height);
    newPos();
    myRobot.pen();
    myRobot.update();
}

// function drawRobot(X, Y, theta){

//     var size = scale*0.4;
//     var radius = Math.sqrt(Math.pow(size/2,2)*2);
//     var triangle = new Path2D();
//     triangle.moveTo(X+radius*Math.sin(theta),Y-radius*Math.cos(theta));
//     triangle.lineTo(X+radius*Math.sin(theta+(2*Math.PI/3)),Y-radius*Math.cos(theta+(2*Math.PI/3)));
//     triangle.lineTo(X+radius*Math.sin(theta+(4*Math.PI/3)),Y-radius*Math.cos(theta+(4*Math.PI/3)));

//     var circle = new Path2D();
//     circle.arc(X, Y, radius, 0, 2 * Math.PI);
    
//     cn.fillStyle = 'white';
//     cn.fill(circle);
//     cn.stroke(circle);
//     cn.fillStyle = 'orange';
//     cn.fill(triangle);
// }

function newPos(){
    errorY = Math.abs(targetY - myRobot.y);
    errorX = Math.abs(targetX - myRobot.x);
    errorR = Math.abs(targetR - myRobot.r);

    if(errorX < 1 && errorY < 1 && errorR < 0.01){

        console.log("New Order")

        currOrder = order.shift();

        switch (currOrder) {
            case "I":
                stopO = order.indexOf("O");
                order.splice(stopO,1);
                if (!isNaN(order[0])){
                    multiple = parseInt(order[0]);
                    order.splice(0,1);
                    for (let i = 0; i < multiple-1; i++){
                        order = order.slice(0,stopO-1).concat(order);
                    }
                } else {
                    order = order.slice(0,stopO).concat(order);
                }
                break;
            case "F":
                if (!isNaN(order[0])){
                    multiple = parseInt(order[0]);
                    order.splice(0,1);
                    for (let i = 0; i < multiple-1; i++){
                        order.unshift(currOrder);
                    }
                }
                targetX += boardCanvas.grid.scale*Math.sin(myRobot.r);
                targetY -= boardCanvas.grid.scale*Math.cos(myRobot.r);
                break;
            case "B":
                if (!isNaN(order[0])){
                    multiple = parseInt(order[0]);
                    order.splice(0,1);
                    for (let i = 0; i < multiple-1; i++){
                        order.unshift(currOrder);
                    }
                }
                targetX -= boardCanvas.grid.scale*Math.sin(myRobot.r);
                targetY += boardCanvas.grid.scale*Math.cos(myRobot.r);
                break;
            case "R":
                if (!isNaN(order[0])){
                    angle = parseInt(order[0])*Math.PI/180;
                    order.splice(0,1);
                } else {
                    angle = Math.PI/2;
                }
                targetR += angle;
                break;
            case "L":
                if (!isNaN(order[0])){
                    angle = parseInt(order[0])*Math.PI/180;
                    order.splice(0,1);
                } else {
                    angle = Math.PI/2;
                }
                targetR -= angle;
        }

        moveX = (targetX - myRobot.x)/(fps*orderSpeed);
        moveY = (targetY - myRobot.y)/(fps*orderSpeed);
        moveR = (targetR - myRobot.r)/(fps*orderSpeed);

    } else {
        myRobot.x += moveX;
        myRobot.y += moveY;
        myRobot.r += moveR;
    }
}

function newPosOld(){
  
//   If last order is done get new order from order array
    if (isOrderDone) {

        multiple = 1;
        
    //   Set new target
    //   Set order to not done
    //   Set current order
        
        currOrder = order[orderIndex];
        
        switch (currOrder) {
            case "I":
                var stopO = order.search("O");
                if (!isNaN(order[orderIndex+1])){
                    multiple = parseInt(order[orderIndex + 1]);
                    order = order.replace(order.slice(orderIndex,stopO+1), order.slice(orderIndex+2,stopO).repeat(multiple))
                } else {
                    order = order.replace(order.slice(orderIndex,stopO+1), order.slice(orderIndex+1,stopO).repeat(multiple))
                }
                break;
            case "F":
                if (!isNaN(order[orderIndex+1])){
                    multiple = parseInt(order[orderIndex + 1]);
                    order = order.replace(order[orderIndex + 1], currOrder.repeat(multiple - 1));
                }
                targetX += scale*Math.sin(currR);
                targetY -= scale*Math.cos(currR);
                break;
            case "B":
                if (!isNaN(order[orderIndex+1])){
                    multiple = parseInt(order[orderIndex+1]);
                    order = order.replace(order[orderIndex + 1], currOrder.repeat(multiple - 1));
                }
                targetX -= scale*Math.sin(currR);
                targetY += scale*Math.cos(currR);
                break;
            case "R":
                if (!isNaN(order[orderIndex+1])){
                    angle = parseInt(order.match(/\d+/))*Math.PI/180;
                    order = order.replace(order.match(/\d+/), '');
                } else {
                    angle = Math.PI/2;
                }
                targetR += angle;
                break;
            case "L":
                if (!isNaN(order[orderIndex+1])){
                    angle = parseInt(order.match(/\d+/))*Math.PI/180;
                    order = order.replace(order.match(/\d+/), '');
                } else {
                    angle = Math.PI/2;
                }
                targetR -= angle;
        }
        
        moveX = (targetX - currX)/(fps*orderSpeed);
        moveY = (targetY - currY)/(fps*orderSpeed);
        moveR = (targetR - currR)/(fps*orderSpeed);
        
        isOrderDone = false;
        
        console.log("Order Received");
    }
    
    errorX = Math.abs(targetX - currX);
    errorY = Math.abs(targetY - currY);
    errorR = Math.abs(targetR - currR);
    
    if(errorX < 1 && errorY < 1 && errorR < 0.01){
        
        i++;

        if(i > Math.round(fps/2)){
            isOrderDone = true;
            orderIndex += 1;
            console.log("Order Done");
            i = 0;
        }
        

        if(orderIndex === order.length){
            stop();
        }

    } else {
        // cn.clearRect(0, 0, canvas.width, canvas.height);
        // cn.drawImage(image, 0, 0, 800, 640);
        // cn.lineTo(currX, currY);
        myRobot.x += moveX;
        myRobot.y += moveY;
        myRobot.r += moveR;
    }
}

// function stop(){
//     clearInterval(drawInt);
// }

// drawInt = setInterval(draw, 1000/fps);
