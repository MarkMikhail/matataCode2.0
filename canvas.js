// This file manages the canvas element in MatataCode with regards to animations and robot logic

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

    this.Tx = X;
    this.Ty = Y;
    this.Tr = R;

    this.color = color;

    this.speed = 0.02;

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

    order = [];

    myRobot.Tx = myRobot.x;
    myRobot.Ty = myRobot.y;
    myRobot.Tr = myRobot.r;
}

function newPos(){

    errorY = Math.abs(myRobot.Ty - myRobot.y);
    errorX = Math.abs(myRobot.Tx - myRobot.x);
    errorR = Math.abs(myRobot.Tr - myRobot.r);

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
                myRobot.Tx += boardCanvas.grid.scale*Math.sin(myRobot.r);
                myRobot.Ty -= boardCanvas.grid.scale*Math.cos(myRobot.r);
                break;
            case "B":
                if (!isNaN(order[0])){
                    multiple = parseInt(order[0]);
                    order.splice(0,1);
                    for (let i = 0; i < multiple-1; i++){
                        order.unshift(currOrder);
                    }
                }
                myRobot.Tx -= boardCanvas.grid.scale*Math.sin(myRobot.r);
                myRobot.Ty += boardCanvas.grid.scale*Math.cos(myRobot.r);
                break;
            case "R":
                if (!isNaN(order[0])){
                    angle = parseInt(order[0])*Math.PI/180;
                    order.splice(0,1);
                } else {
                    angle = Math.PI/2;
                }
                myRobot.Tr += angle;
                break;
            case "L":
                if (!isNaN(order[0])){
                    angle = parseInt(order[0])*Math.PI/180;
                    order.splice(0,1);
                } else {
                    angle = Math.PI/2;
                }
                myRobot.Tr -= angle;
                break;
            default:
                // Do nothing
        }

        moveX = (myRobot.Tx - myRobot.x)*myRobot.speed;
        moveY = (myRobot.Ty - myRobot.y)*myRobot.speed;
        moveR = (myRobot.Tr - myRobot.r)*myRobot.speed;

    } else {
        myRobot.x += moveX;
        myRobot.y += moveY;
        myRobot.r += moveR;
    }
}