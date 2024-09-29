var board;
var score = 0;
var highScore = 0; // High score variable
var rows = 4;
var columns = 4;
var lastMove = ""
let boardHistory = [];
let scoreHistory = [];
let undoAfterGameOver = false
let gameOver = false

window.onload = function() {
    setGame();
}

function saveState() {
    // Save a deep copy of the board and score (for the undo function)
    if(boardHistory.length >= 3){
        boardHistory.shift()
    }
    if(boardHistory.length <= 3){
        boardHistory.push(JSON.parse(JSON.stringify(board)));
        scoreHistory.push(score);
    }
}


function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;
    
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // Clear the board

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            boardElement.append(tile);
        }
    }
    setTwo();
    setTwo();
    const highScoreElement = document.getElementById("high-score");
    highScore = localStorage.getItem('highScore');
    highScoreElement.innerText = highScore; // Update displayed high score 
}

function resetGame() {
    if (!document.getElementById("game-over-message").classList.contains("hidden")){
        document.getElementById("game-over-message").classList.add("hidden"); // Hide game over message
        setGame(); // Restart the game
    }else {
        if (confirm("Hey CPUer! Do you really want to reset the game?")){
            setGame(); // Restart the game
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

function updateHighScore() {
    const highScoreElement = document.getElementById("high-score");
    highScoreElement.innerText = highScore; // Update displayed high score
    localStorage.setItem('highScore',JSON.stringify(highScore));
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        if (lastMove!="left")
            setTwo();
        lastMove = "left"
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        if (lastMove!="right")
            setTwo();
        lastMove = "right"
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        if (lastMove!="up")
            setTwo();
        lastMove = "up"
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        if (lastMove!="down")
            setTwo();
        lastMove = "down"
    }
    document.getElementById("score").innerText = score;
    
    // Check if the score exceeds the high score and update it
    if (score > highScore) {
        highScore = score;
        updateHighScore();
    }
    
    // After each move, check if the game is over
    if (checkGameOver()) {
        document.getElementById("game-over-message").classList.remove("hidden");
    }
})

function filterZero(row) {
    return row.filter(num => num != 0); // Create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    if (!gameOver) saveState();
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    if (!gameOver) saveState();
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    if (!gameOver) saveState();
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    if (!gameOver) saveState();
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
            
        }
    }
}

function undoMove() {
    if (boardHistory.length > 0) {
        if(gameOver){
            document.getElementById("game-over-message").classList.add("hidden");
            undoAfterGameOver = true
            gameOver = false
        }
        board = boardHistory.pop();  // Restore the previous board
        score = scoreHistory.pop();  // Restore the previous score
        // Update the visual board
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num); 
            }
        }
    }
}


function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return false; // Still moves left
            }
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return false; // Moves can be made horizontally
            }
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return false; // Moves can be made vertically
            }
        }
    }
    gameOver = true
    return true; // No moves left, game over
}

//For PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
  
let touchstartX = 0
let touchendX = 0

let touchstartY = 0
let touchendY = 0

function handleGesture(e){
  if (touchendX - touchstartX < -45){
        slideLeft();
        if (lastMove!="left")
            setTwo();
        lastMove = "left"
    }
    else if (touchendX - touchstartX > 45){
        slideRight();
        if (lastMove!="right")
            setTwo();
        lastMove = "right"
    }
    else if (touchendY - touchstartY < -45){
        slideUp();
        if (lastMove!="up")
            setTwo();
        lastMove = "up"
    }
    else if (touchendY - touchstartY > 45){
        slideDown();
        if (lastMove!="down")
            setTwo();
        lastMove = "down"
    }
    document.getElementById("score").innerText = score;
    if (score > highScore) {
        highScore = score;
        updateHighScore();
        
    }
    // After each move, check if the game is over
    if (!undoAfterGameOver && checkGameOver()) {
        document.getElementById("game-over-message").classList.remove("hidden");
    }
}
document.querySelector(".reset-button").addEventListener("click", ()=>resetGame);
document.body.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
    touchstartY = e.changedTouches[0].screenY
})
document.body.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    touchendY = e.changedTouches[0].screenY
  handleGesture(e)
})
