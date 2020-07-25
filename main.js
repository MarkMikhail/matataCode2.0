const board = document.querySelector(".board");

// drawBlocks();

repeatNode(document.querySelector(".block"), 18, true);
repeatNode(document.querySelector(".up"), 4, true);
repeatNode(document.querySelector(".down"), 4, true);
repeatNode(document.querySelector(".right"), 4, true);
repeatNode(document.querySelector(".left"), 4, true);
repeatNode(document.querySelector(".two"), 2, true);
repeatNode(document.querySelector(".three"), 2, true);
repeatNode(document.querySelector(".four"), 2, true);
repeatNode(document.querySelector(".five"), 2, true);
repeatNode(document.querySelector(".start"), 2, true);
repeatNode(document.querySelector(".stop"), 2, true);

const orderEmpty = document.querySelectorAll(".order");
const numberEmpty = document.querySelectorAll(".block .number");

const stores = document.querySelectorAll(".store");

const upArrow = document.querySelectorAll(".orderSub");
const numbers = document.querySelectorAll(".numberSub");

const boardContainer = document.querySelector(".container");
const blocks = document.querySelectorAll(".block");
const storeAnim = document.querySelector(".tabsFull");
const canvasAnim = document.querySelector("#myCanvas");

const tabButtons = document.querySelectorAll(".tabBut");
const tabs = document.querySelectorAll(".storeContainer");

const mainStores = document.getElementById("stores");

let isMouseDown = false;
let floatSelected = false;
let offset = [0, 0];
let draggedElement = [];
let targetOver;
let orders;

// Tab listeners
// Uncomment for tab functionality
for(button of tabButtons){
    button.addEventListener("click", function() {
        for(button of tabButtons){
            button.classList.remove("active");
        }

        for(tab of tabs){
            tab.classList.remove("active");
        }

        this.classList.add("active");

        let tabNum = this.dataset.tab;
        tabs[tabNum].classList.add("active")
    });
}

// Arrow listeners
for(arrow of upArrow){
    arrow.addEventListener("mousedown", dragStart);
    arrow.addEventListener("touchstart", dragStart);
}

for(number of numbers){
    number.addEventListener("mousedown", dragStart);
    number.addEventListener("touchstart", dragStart);
}

document.addEventListener("mousemove", dragProcess);
document.addEventListener("touchmove", dragProcess);

document.addEventListener("mouseup", dragEnd);
document.addEventListener("touchend", dragEnd);

document.querySelector("#play").addEventListener("click", function(){
    orders = [];

    boardContainer.classList.add("move");
    storeAnim.classList.add("move");
    canvasAnim.classList.add("move");

    for (block of blocks){
        block.classList.add("move");

        if (block.children[0].children.length) {
            orders.push(block.children[0].children[0].dataset.command);

            if (block.children[1].children.length) {
                orders.push(block.children[1].children[0].dataset.command);
            }
        }
    }

    order = orders;

    // stop();
    // setup();

    // drawInt = setInterval(draw, 1000/fps);
})

document.querySelector("#reset").addEventListener("click", function(){
    boardContainer.classList.remove("move");
    storeAnim.classList.remove("move");
    canvasAnim.classList.remove("move");
    for (block of blocks){
        block.classList.remove("move");
    }
    reset();
})

function drawBlocks() {
  for(var i = 0; i < 18; i++){
    board.innerHTML += "<div class='block'><div class='order'></div><div class='number'></div></div>";
  }
}

function repeatNode(node, count, deep) {
    for (var i = 0, copy; i < count - 1; i++) {
        copy = node.cloneNode(deep);
        node.parentNode.insertBefore(copy, node);
    }
}

function dragStart(ev) {
    ev.preventDefault();
    try {
        ev = ev.targetTouches[0];
    } catch {} finally {
        isMouseDown = true;
        offset = [this.offsetLeft - ev.clientX, this.offsetTop - ev.clientY];
        draggedElement.push(this);
        // console.log(draggedElement);
        draggedElement[0].style.pointerEvents = "none";
    }
}

function dragProcess(ev){
    ev.preventDefault();
    try {
        ev = ev.targetTouches[0];
    } catch {} finally {
        if (isMouseDown) {
            // console.log('event triggered');
            draggedElement[0].style.left = ev.clientX + offset[0] + 'px';
            draggedElement[0].style.top = ev.clientY + offset[1] + 'px';
            draggedElement[0].style.right = - parseInt(draggedElement[0].style.left) + 'px';
            draggedElement[0].style.bottom = - parseInt(draggedElement[0].style.top) + 'px';

            if (isNaN(draggedElement[0].dataset.command)){
                for (empty of orderEmpty) {
                    emptyRect = empty.getBoundingClientRect();
                    if(ev.clientX > emptyRect.left & ev.clientX < emptyRect.right & ev.clientY > emptyRect.top & ev.clientY < emptyRect.bottom){
                        if (empty.children.length === 0){
                            empty.classList.add("hovered");
                            targetOver = empty;
                        }
                    } else {
                        empty.classList.remove("hovered");
                    }
                }
            } else {
                for (empty of numberEmpty) {
                    emptyRect = empty.getBoundingClientRect();
                    if(ev.clientX > emptyRect.left & ev.clientX < emptyRect.right & ev.clientY > emptyRect.top & ev.clientY < emptyRect.bottom){
                        if (empty.children.length === 0){
                            if (empty.parentElement.children[0].children.length !== 0){
                                if (empty.parentElement.children[0].children[0].dataset.command === "F" || empty.parentElement.children[0].children[0].dataset.command === "B" || empty.parentElement.children[0].children[0].dataset.command === "I"){
                                    empty.classList.add("hovered");
                                    targetOver = empty;
                                }
                            }
                        }
                    } else {
                        empty.classList.remove("hovered");
                    }
                }
            }


            storeRect = mainStores.getBoundingClientRect();
            if(ev.clientX > storeRect.left & ev.clientX < storeRect.right & ev.clientY > storeRect.top & ev.clientY < storeRect.bottom){
                mainStores.classList.add("hovered");

                for (store of stores) {
                    if(store.dataset.store === draggedElement[0].dataset.command){
                        targetOver = store;
                    }
                }

            } else {
                mainStores.classList.remove("hovered");
            }
        }
    }
}

function dragEnd(ev){
    isMouseDown = false;

    mainStores.classList.remove("hovered");

    // console.log("Mouse Up");
    if(draggedElement[0]){
        if(targetOver){
            targetOver.append(draggedElement[0]);
            targetOver.classList.remove("hovered");
            targetOver = undefined;
        }
        draggedElement[0].style.left = null;
        draggedElement[0].style.top = null;
        draggedElement[0].style.right = null;
        draggedElement[0].style.bottom = null;

        // draggedElement[0].style.left = 0 + 'px';
        // draggedElement[0].style.top = 0 + 'px';
        // draggedElement[0].style.right = - parseInt(draggedElement[0].style.left) + 'px';
        // draggedElement[0].style.bottom = - parseInt(draggedElement[0].style.top) + 'px';
        
        draggedElement[0].style.pointerEvents = "auto";
        draggedElement.pop();
    }
}

const float = document.querySelector("#myCanvas");
float.classList.add("float");

float.addEventListener("mousedown", floatDragStart);
float.addEventListener("touchstart", floatDragStart);

document.addEventListener("mousemove", floatDragProcess);
document.addEventListener("touchmove", floatDragProcess);

document.addEventListener("mouseup", floatDragEnd);
document.addEventListener("touchend", floatDragEnd);

function floatDragStart(ev) {
    ev.preventDefault();
    try {
        ev = ev.targetTouches[0];
    } catch {} finally {
        floatSelected = true;
        offset = [this.offsetLeft - ev.clientX, this.offsetTop - ev.clientY];
    }
}

function floatDragProcess(ev){
    ev.preventDefault();
    try {
        ev = ev.targetTouches[0];
    } catch {} finally {
        if (floatSelected) {
            // console.log('event triggered');
            float.style.top = ev.clientY + offset[1] + 'px';
            // float.style.bottom = - parseInt(float.style.top) + 'px';

            if (ev.clientX < window.innerWidth/2){
                float.style.left = '10px';
                float.style.right = null;
            } else {
                float.style.right = '10px';
                float.style.left = null;
            }
        }
    }
}

function floatDragEnd(ev){
    floatSelected = false;
}