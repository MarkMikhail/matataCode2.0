const canvas = document.getElementById("myCanvas");
const cn = canvas.getContext("2d");

const grid_width = 5;
const scale = canvas.width/grid_width;
const start_pos = [scale*(1-0.5), scale*(4-0.5)];

const fps = 25;
const orderSpeed = 2;

// Initialising position variables
var targetX = start_pos[0];
var targetY = start_pos[1];
var targetR = 0;

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

function startBoard(maze, init = [1,4,0]){

    order = [];
    boardCanvas.setup();
    boardCanvas.grid.set(5);

    myRobot = new robot(boardCanvas.grid.getx(init[0]), boardCanvas.grid.gety(init[1]), init[2]);
    background = new Image();
    background.src = maze;
    background.onload = function(){
        boardCanvas.start();
    }
}

function robot(X, Y, R, color = 'orange', ) {
    this.x = X;
    this.y = Y;
    this.r = R;
    this.color = color;

    this.penLine = new Path2D();
    this.penLine.moveTo(this.x, this.y);

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
        this.penLine.lineTo(this.x, this.y);

        ctx = boardCanvas.context;
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.color;
        ctx.stroke(this.penLine);
    }
}

function updateBoardArea(){

    boardCanvas.clear();
    
    boardCanvas.context.drawImage(background, 0, 0, boardCanvas.canvas.width, boardCanvas.canvas.height);
    newPos();
    myRobot.pen();
    myRobot.update();
}

function reset(){
    myRobot.x = boardCanvas.grid.getx(1);
    myRobot.y = boardCanvas.grid.gety(4);
    myRobot.r = 0;

    myRobot.penLine = new Path2D();

    targetX = boardCanvas.grid.getx(1);
    targetY = boardCanvas.grid.gety(4);
    targetR = 0;
}

function newPos(){

    errorY = Math.abs(targetY - myRobot.y);
    errorX = Math.abs(targetX - myRobot.x);
    errorR = Math.abs(targetR - myRobot.r);

    if(errorX < 1 && errorY < 1 && errorR < 0.01){

        if (order.length === 0) {
            return
        }

        // console.log("New Order");

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
                break;
            default:
                // Do nothing
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