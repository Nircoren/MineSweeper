var gBoard = []
const EMPTY = ''
const MINE = '☀'

const gLevel = {
    SIZE: 4,
    MINES: 1,
    LIVES: 3,
    HINTS: 3,
    LEVEL:1
};
const gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    markedMines: 0,
    secsPassed: 0,
    smiley: '😃',
    safeClicks: 3,
    manualMines: false,
    isSevenBoom: false,
    megaHint: {
        isMegaHint: 0,
        upLeft: { i: -1, j: -1 },
        downRight: { i: -1, j: -1 }
    },
    //change this name.
    hints: { isHintMode: false, hintClicked: null }
   
}

const gUndo = {
    undoArr: [],
    undoCount: 0
}
const noRightClick = document.querySelector(".board");
noRightClick.addEventListener("contextmenu", e => e.preventDefault());//cell:

var gTimeInterval;

function initGame() {
    gBoard = [];
    createBoard();
    renderBoard();
    resetgGame();
    renderLives();
}

//change initial smilty position.
function resetgGame() {
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.markedMines = 0;
    gGame.smiley = '😃'
    gGame.hints = { isHintMode: false, hintClicked: null };
    gGame.safeClicks = 3;
    gGame.manualMines = false;
    gGame.isSevenBoom = false;
    gGame.megaHint= {
        isMegaHint: 0,
        upLeft: { i: -1, j: -1 },
        downRight: { i: -1, j: -1 }
    },

    gUndo.undoArr = [];
    gUndo.undoCount = 0;
    // gLevel.MINES = document.querySelector(`[data-level="${gLevel.LEVEL}"]`).dataset.mines
    document.querySelector('.smiley').innerText = gGame.smiley;
    document.querySelector(".safeClicksLeft").innerText = gGame.safeClicks;
    document.querySelector(".time").innerText = gGame.secsPassed;
    if (gTimeInterval) clearInterval(gTimeInterval);
    gTimeInterval = null;
    

}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            //neighbors loop.
            var currCell = gBoard[i][j]
            for (var row = i - 1; row <= i + 1; row++) {
                if (row < 0 || row > gLevel.SIZE - 1) continue;
                for (var col = j - 1; col <= j + 1; col++) {
                    if ((row === i && col === j) || col < 0 || col > gLevel.SIZE - 1) continue;
                    if (gBoard[row][col].isMine) currCell.minesAroundCount += 1;
                }
            }
            if (currCell.isMine) continue;
            if (!currCell.minesAroundCount) document.querySelector(`.cell-${i}-${j} span`).innerHTML = 'emp';
            else document.querySelector(`.cell-${i}-${j} span`).innerHTML = currCell.minesAroundCount;

            //  console.log(row,col,gBoard[row][col].minesAroundCount);
            //maybe switch to renderCell

        }
    }
}


function createBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i].push({
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            });
        }
    }
}

function renderBoard() {
    var boardStr = '';
    var idx = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        boardStr += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            tdClassName = 'cell';
            contentClassName = 'hidden';
            cellIdx =
                boardStr += `<td data-idx = "${idx++}" class="${tdClassName + ` cell-${i}-${j}`}" 
                onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})">
                <span class="${contentClassName}"></span></td>`;
        }
        boardStr += '</tr>';
    }
    document.querySelector('.board').innerHTML = boardStr;
}

function cellClicked(elCell, i, j) {
    if (gGame.megaHint.isMegaHint === 1) {
        gGame.megaHint.upLeft.i = i;
        gGame.megaHint.upLeft.j = j;
        gGame.megaHint.isMegaHint++;
        return;
    } else if (gGame.megaHint.isMegaHint === 2) {
        gGame.megaHint.downRight.i = i;
        gGame.megaHint.downRight.j = j;
        return;
    }
    if (gGame.manualMines) {
        if (gLevel.MINES) gLevel.MINES = 0;
        gBoard[i][j].isMine = true;
        document.querySelector(`.cell-${i}-${j} span`).innerHTML = MINE;
        return;
    }
    if (!gGame.shownCount) {
        if (gLevel.MINES && !gGame.isSevenBoom) placeMines(i, j);
        setMinesNegsCount();
        if (!gTimeInterval) gTimeInterval = setInterval(updateTime, 1000);
    } else if (gGame.hints.isHintMode) {
        revealCellsOnHint(gGame.hints.hintClicked, i, j);
        return
    }
    if (!gBoard[i][j].isShown && gGame.isOn && !gBoard[i][j].isMarked) {
        gUndo.undoArr.push([]);
        if (!gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine) {
            expandShown(elCell, i, j);
        } else {
            cellShown(elCell, i, j);
            gUndo.undoArr[gUndo.undoCount].push({ i: i, j: j, marked: false });
        }
        gUndo.undoCount++;

    }
    checkGameOver(true, i, j);
}

function cellMarked(elCell, i, j) {
    if (!gTimeInterval) gTimeInterval = setInterval(updateTime, 1000);
    if (!gBoard[i][j].isShown) {
        if (gBoard[i][j].isMine) {
            gGame.markedMines += gBoard[i][j].isMarked ? -1 : 1;
            checkGameOver(false, i, j);
        }
        gGame.markedCount++;
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
        elCell.classList.toggle('marked');
        gUndo.undoArr.push([]);
        gUndo.undoArr[gUndo.undoCount].push({ i: i, j: j, isMarked: true });
        gUndo.undoCount++;

    }
}

function checkGameOver(isClicked, i, j) {
    //delete repetition.
    if (gBoard[i][j].isMine && isClicked) {
        gLevel.LIVES--;
        renderLives();
        if (!gLevel.LIVES) {
            revealMines();
            gameEnded('🤯', 'lose!')
        }
    }
    if (gGame.shownCount + gGame.markedMines === gLevel.SIZE ** 2) {
        gameEnded('😎', 'win!');
    }

}

function gameEnded(smileyStr, messege) {
    alert(messege);
    gGame.smiley = smileyStr
    gGame.isOn = false;
    clearInterval(gTimeInterval);
    document.querySelector('.smiley').innerText = gGame.smiley
}

//create a cellIdx function?
//remove return?
function renderCell(cellObj) {
    return document.querySelector(`.${cellObj.idx}`).innerHTML = cellObj.value;
}


function expandShown(elCell, i, j) {
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row > gLevel.SIZE - 1) continue;
        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col > gLevel.SIZE - 1) continue;
            if (gBoard[row][col].isShown) {
                continue;
            }
            var elCell = document.querySelector(`.cell-${row}-${col}`);
            cellShown(elCell, row, col);
            gUndo.undoArr[gUndo.undoCount].push({ i: row, j: col, isMarked: false });
            if (!gBoard[row][col].minesAroundCount) {
                expandShown(elCell, row, col);
            }
        }
    }
}


function cellShown(elCell, i, j) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    elCell.querySelector("span").classList.toggle('hidden');
    elCell.classList.toggle('shownCell');
    
}


function updateTime() {
    gGame.secsPassed++;
    document.querySelector(".time").innerText = gGame.secsPassed;
}



function setLevel(level) {
    gLevel.SIZE = level.dataset.size;
    gLevel.LIVES = 3;
    gLevel.currLevel = level.dataset.level;
    initGame();
    gLevel.MINES = level.dataset.mines;
    console.log( gLevel.MINES);
}


