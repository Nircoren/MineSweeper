
//consider putings mines in an array and then looping through it instead of looping thorght the board.
function revealMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                document.querySelector(`.cell-${i}-${j} span`).classList.remove("hidden");
            }
        }
    }
}

function placeMines(i, j) {
    // Copy gboard in order to prevent repeating loop (if a mine is placed on top of a mine).
    //i need to fix this.
    // var emptyCells = gBoard.slice();
    var randI;
    var randJ;
    var currCell;
    var counter = gLevel.MINES;
    while (counter) {
        randI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        randJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        currCell = gBoard[randI][randJ];
        if ((randI === i && randJ === j) || currCell.isMine === true) continue;
        currCell.isMine = true;
        document.querySelector(`.cell-${randI}-${randJ} span`).innerHTML = MINE;
        counter--;
    }
}

//design better ux for the manual mines mode. show the player when hes in this mode.
function manualMines() {
    if (gGame.shownCount) return;
    gGame.manualMines = !gGame.manualMines;
}

//prevent repetition
function sevenBoom() {
    initGame()
    gGame.isSevenBoom = true;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellIdx = document.querySelector(`.cell-${i}-${j}`).dataset.idx;
            if (!(cellIdx % 7) || !((cellIdx-7) % 10)){
                console.log(cellIdx);

                gBoard[i][j].isMine = true;
                document.querySelector(`.cell-${i}-${j} span`).innerHTML = MINE;
            }
               
        }
    }

}