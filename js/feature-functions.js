// change feature functions name.
//function loops too much, find solution for it.
function onSafeClick() {
    //maybe add a prompt.
    if (!gGame.safeClicks || !gGame.shownCount || !gGame.isOn) return
    var cellNotFound = true;
    var randI;
    var randJ;
    while (cellNotFound) {
        randI = getRandomIntInclusive(0, gLevel.SIZE - 1);
        randJ = getRandomIntInclusive(0, gLevel.SIZE - 1);
        console.log(randI, randJ);
        if (!gBoard[randI][randJ].isMine && !gBoard[randI][randJ].isShown) {
            console.log(gBoard[randI][randJ], !gBoard[randI][randJ].isMine);
            var safeCell = document.querySelector(`.cell-${randI}-${randJ}`);
            safeCell.classList.add("safeCell");
            const wo = setTimeout(() => {
                safeCell.classList.remove("safeCell")
            }, 3000);
            cellNotFound = false;
        }
    }
    gGame.safeClicks -= 1;
    document.querySelector(".safeClicksLeft").innerText = gGame.safeClicks;

}

// change name.
function revealCellsOnHint(hintClicked, i, j) {
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row > gLevel.SIZE - 1) continue;
        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col > gLevel.SIZE - 1) continue;
            var elCell = document.querySelector(`.cell-${row}-${col} span`);
            // console.log(elCell);
            if (elCell.classList.contains("hidden")) {
                elCell.classList.toggle("hidden");
                returnToHidden(elCell);
            }

        }
    }
    gGame.hints.isHintMode = false;
    document.querySelector(`[data-hint-num="${gGame.hints.hintClicked}"]`).innerText = ''
    gGame.hints.hintClicked = null;
}

//why didnt it work inside the loop?
function returnToHidden(elCell) {
    setTimeout(function () {
        elCell.classList.add("hidden");
    }, 2000)
}

function renderLives() {
    var counter = gLevel.LIVES;
    var livesStr = '';
    while (counter) {
        livesStr += 'L';
        counter--;
    }
    document.querySelector(".lives").innerText = livesStr
}

function onHintsClick(hint) {
    if (gGame.hints.isHintMode && gGame.hints.hintClicked !== hint.dataset.hintNum) return;
    hint.innerText = gGame.hints.isHintMode ? 'L' : 'C';
    gGame.hints.isHintMode = !gGame.hints.isHintMode;
    gGame.hints.hintClicked = hint.dataset.hintNum;
}

function undo() {
    if (!gUndo.undoCount) return;
    if (!gGame.isOn) return;
    var lastMove = gUndo.undoArr[gUndo.undoCount - 1];
    for (var i = 0; i < lastMove.length; i++) {
        //change modelCell name.
        var changedCell = lastMove[i];
        var modelCell = gBoard[changedCell.i][changedCell.j];
        if (changedCell.isMarked) {
            modelCell.isMarked = false;
            gGame.markedCount--;
            if (modelCell.isMine) {
                gGame.markedMines--;
                gGame.LIVES++;
                //fix this.
                renderLives();
            }
            // should i add those?
            // safeClicks
            // hints
            document.querySelector(`.cell-${changedCell.i}-${changedCell.j}`).classList.remove("marked");
        }
        else {
            //delete repetition
            modelCell.isShown = false;
            gGame.shownCount--;
            document.querySelector(`.cell-${changedCell.i}-${changedCell.j} span`).classList.add("hidden");
            document.querySelector(`.cell-${changedCell.i}-${changedCell.j}`).classList.remove('shownCell');
        }
    }
    gUndo.undoCount--;
}

function megaHint() {
    gGame.megaHint.isMegaHint++;
    gGame.manualMines = false;
}

// megaHint: {
//     isMegaHint: 0,
//     upLeft: { i: -1, j: -1 },
//     downRight: { i: -1, j: -1 }
// },
function showMegaHint(obj){
    for(var i = obj.upLeft.i; i <= obj.downRight.i; i++){
        for(var j = 0; j < obj.j; j++){

        }
    }
    var elCell = document.querySelector(`.cell-${row}-${col} span`);
    // console.log(elCell);
    if (elCell.classList.contains("hidden")) {
        elCell.classList.toggle("hidden");
        returnToHidden(elCell);
    }
   
    
}