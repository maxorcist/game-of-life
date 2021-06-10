// Game of Life

//setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Color background
ctx.fillStyle = "#004";
ctx.fillRect(0, 0, canvas.width, canvas.height);


// Setup board
const squareSize = 10;
const sq = squareSize - 1;
const boardSize = {
    width: (canvas.width - (canvas.width % squareSize)) / squareSize,
    height: (canvas.height - (canvas.height % squareSize)) / squareSize,
};
let board = populateBoard();
const boardLength = board.length;
function populateBoard(){
    b = [];
    for(let x = 0; x < boardSize.width; x++){
        for(let y = 0; y < boardSize.height; y++){
            b.push([x, y, 0]);
        }
    }
    return b;
}

// The offset to center board on canvas
const startPos = {
    x: (canvas.width % squareSize) / 2,
    y: (canvas.height % squareSize) / 2,
}

// Find the index of the matrix containing the coordinates
function getIndexFromCoords(x, y){
    return boardSize.height * x + y;
}

// Create set for keeping track of living cells
let population = new Set();

const isAlive = (index) => {
    return Boolean(board[index][2]);
}

// Finding neighbors
function getNeighbors(i){
    let north = i - 1;
    let east = i + boardSize.height;
    let south = i + 1;
    let west = i - boardSize.height;
    let nw = west -1;
    let sw = west + 1;
    let ne = east - 1;
    let se = east + 1;
    let neighbors = [nw, north, ne, east, se, south, sw, west];
    return neighbors.filter(x => x >= 0 && x < boardLength);
}
function numberOfLiving(neighbors = []){
    livingNeighbors = neighbors.filter(x => (
        x >= 0 && x < boardLength && board[x][2]
    ))
    return livingNeighbors.length;
}
function getLivingNeighbors(i){
    let neighbors = getNeighbors(i);
    let livingNeighbors = neighbors.filter(x => board[x][2] )
    return livingNeighbors.length;
}

// Drawing functions
function drawBoard(){
    ctx.fillStyle = "#000";
    board.forEach(s => {
        ctx.fillRect(startPos.x + s[0] * squareSize, startPos.y + s[1] * squareSize, sq, sq);
    })
}
function drawCell(color, x, y){
    ctx.fillStyle = color;
    ctx.fillRect(startPos.x + x * squareSize, startPos.y + y * squareSize, sq, sq)
}

// Change living/dead property of a cell
function killCell(cell){
    drawCell("#000", cell[0], cell[1]);
    cell[2] = 0;
    return cell;
}

function birthCell(cell){
    drawCell("#00FF02", cell[0], cell[1]);
    cell[2] = 1;
    return cell;
}

function toggleCell(cell){
    let index = getIndexFromCoords(cell[0], cell[1]);
    toggleIndex(index);
}

function toggleIndex(index){
    let cell = board[index];
    if (cell[2] === 0){
        board[index] = birthCell(cell);
        population.add(index);
    } else {
        board[index] = killCell(cell);
        population.delete(index);
    }
}

// Mouse event
canvas.onclick = (evt) => {
    let mouse = getMousePos(canvas, evt);
    let mx = Math.floor((mouse.x - startPos.x ) / squareSize);
    let my = Math.floor((mouse.y - startPos.y) / squareSize);
    toggleCell(board[getIndexFromCoords(mx, my)]);
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

// randomizer button
function randomizeLife(){
    let amount = Math.floor(Math.random() * boardLength);
    for (let i = 0; i <= amount; i++){
        toggleIndex(Math.floor(Math.random() * boardLength));
    }
}

//Init
drawBoard();

const clearCanvas = () => {
    drawBoard();
    population.clear();
    killList.clear();
    birthList.clear();
}

let killList = new Set();
let birthList = new Set();

// Run simulation
let interval;
function life(){
    if (!interval) {
        interval = setInterval(run, 100);
    }
    else {
        clearInterval(interval);
        interval = null;
    }
}

const run = () => {
        killList.clear();
        birthList.clear();
        population.forEach(p => {
            let neighbors = getNeighbors(p);
            let numOfLiving = numberOfLiving(neighbors);
            if (numOfLiving < 2 || numOfLiving > 3){
                killList.add(p);
            }
            neighbors.forEach(n => {
                if (board[n][2] === 0 && getLivingNeighbors(n) === 3) {
                    birthList.add(n);
                }
            })
        })
        killList.forEach(x => {
            population.delete(x);
            toggleIndex(x);
        })
        birthList.forEach(x => {
            toggleIndex(x);
        })
    }

