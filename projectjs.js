var board;
var score = 0;
var highScore = 0; // High score variable
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
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
    updateHighScore(); // Update high score display
}

function resetGame() {
    document.getElementById("game-over-message").classList.add("hidden"); // Hide game over message
    setGame(); // Restart the game
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
}

document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
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
    return true; // No moves left, game over
}
let touchstartX = 0
let touchendX = 0

let touchstartY = 0
let touchendY = 0

function handleGesture(e){
  //alert(touchendX - touchstartX);
  if (touchendX - touchstartX < -45){
    slideLeft();
    setTwo()
    }
    else if (touchendX - touchstartX > 45){
        SlideRight();
        setTwo()
    }
    else if (touchendY - touchstartY < -45){
        SlideUp();
        setTwo()
    }
    else if (touchendY - touchstartY > 45){
        slideDown();
        setTwo()
    }
}
document.body.addEventListener('touchstart', e => {
touchstartX = e.changedTouches[0].screenX
touchstartY = e.changedTouches[0].screenY
})
document.body.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  touchendY = e.changedTouches[0].screenY
  handleGesture(e)
})
