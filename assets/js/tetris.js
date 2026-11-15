// =====================================
// TETRIS VARIABLES
// =====================================

let tetrisBoard;
let currentPiece;
let nextPiece;

let tetrisGameOver = false;

let tetrisFrame = 0;
let dropSpeed = 20;

let tetrisScore = 0;
let tetrisLevel = 1;
let tetrisLines = 0;

const COLS = 10;
const ROWS = 20;
const BLOCK = 14;

// =====================================
// COLORS
// =====================================

const COLORS = [
    "#000000",
    "#00FFFF", // I
    "#FFFF00", // O
    "#AA00FF", // T
    "#00FF00", // S
    "#FF0000", // Z
    "#0000FF", // J
    "#FF8800"  // L
];

// =====================================
// TETROMINOES
// =====================================

const SHAPES = [

    // I
    [
        [1,1,1,1]
    ],

    // O
    [
        [1,1],
        [1,1]
    ],

    // T
    [
        [0,1,0],
        [1,1,1]
    ],

    // S
    [
        [0,1,1],
        [1,1,0]
    ],

    // Z
    [
        [1,1,0],
        [0,1,1]
    ],

    // J
    [
        [1,0,0],
        [1,1,1]
    ],

    // L
    [
        [0,0,1],
        [1,1,1]
    ]
];

// =====================================
// CREATE PIECE
// =====================================

function createPiece() {

    const index = Math.floor(
        Math.random() * SHAPES.length
    );

    return {

        matrix: SHAPES[index],

        color: index + 1,

        x: Math.floor(COLS / 2) - 1,

        y: 0
    };
}

// =====================================
// INIT
// =====================================

function initTetris() {

    tetrisBoard = [];

    for (let row = 0; row < ROWS; row++) {

        tetrisBoard[row] =
            Array(COLS).fill(0);
    }

    tetrisScore = 0;
    tetrisLevel = 1;
    tetrisLines = 0;

    tetrisFrame = 0;
    dropSpeed = 20;

    tetrisGameOver = false;

    currentPiece = createPiece();
    nextPiece = createPiece();
}

// =====================================
// COLLISION
// =====================================

function collision() {

    for (
        let y = 0;
        y < currentPiece.matrix.length;
        y++
    ) {

        for (
            let x = 0;
            x < currentPiece.matrix[y].length;
            x++
        ) {

            if (!currentPiece.matrix[y][x])
                continue;

            const newX =
                currentPiece.x + x;

            const newY =
                currentPiece.y + y;

            if (
                newX < 0 ||
                newX >= COLS ||
                newY >= ROWS
            ) {
                return true;
            }

            if (
                newY >= 0 &&
                tetrisBoard[newY][newX]
            ) {
                return true;
            }
        }
    }

    return false;
}

// =====================================
// MERGE PIECE
// =====================================

function mergePiece() {

    currentPiece.matrix.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (!value) return;

                    tetrisBoard[
                        currentPiece.y + y
                    ][
                        currentPiece.x + x
                    ] = currentPiece.color;

                }
            );
        }
    );
}

// =====================================
// ROTATE
// =====================================

function rotatePiece() {

    const rotated = [];

    for (
        let x = 0;
        x < currentPiece.matrix[0].length;
        x++
    ) {

        rotated[x] = [];

        for (
            let y =
                currentPiece.matrix.length - 1;
            y >= 0;
            y--
        ) {

            rotated[x].push(
                currentPiece.matrix[y][x]
            );
        }
    }

    const oldMatrix =
        currentPiece.matrix;

    currentPiece.matrix =
        rotated;

    if (collision()) {

        currentPiece.matrix =
            oldMatrix;
    }
}

// =====================================
// CLEAR LINES
// =====================================

function clearLines() {

    let cleared = 0;

    for (
        let y = ROWS - 1;
        y >= 0;
        y--
    ) {

        if (
            tetrisBoard[y].every(
                cell => cell !== 0
            )
        ) {

            tetrisBoard.splice(y, 1);

            tetrisBoard.unshift(
                Array(COLS).fill(0)
            );

            cleared++;
            y++;
        }
    }

    if (cleared === 0) return;

    tetrisLines += cleared;

    switch (cleared) {

        case 1:
            tetrisScore += 100;
            break;

        case 2:
            tetrisScore += 300;
            break;

        case 3:
            tetrisScore += 500;
            break;

        case 4:
            tetrisScore += 800;
            break;
    }

    tetrisLevel =
        Math.floor(
            tetrisLines / 10
        ) + 1;

    dropSpeed =
        Math.max(
            4,
            20 - (tetrisLevel - 1)
        );

    if (
        typeof playSound === "function"
    ) {

        playSound("select");
    }
}

// =====================================
// HIGH SCORE
// =====================================

function saveTetrisHighScore() {

    const best =
        Number(
            localStorage.getItem(
                "tetrisHighScore"
            )
        ) || 0;

    if (tetrisScore > currentHighScore) {

        localStorage.setItem(
            "tetrisHighScore",
            tetrisScore
        );

        updateHighScore();
    }
}

// =====================================
// UPDATE
// =====================================

function updateTetris() {

    if (tetrisGameOver) return;

    currentPiece.y++;

    if (collision()) {

        currentPiece.y--;

        mergePiece();

        clearLines();

        currentPiece = nextPiece;

        nextPiece = createPiece();

        if (collision()) {

            tetrisGameOver = true;

            saveTetrisHighScore();

            if (
                typeof playSound === "function"
            ) {

                playSound("gameover");
            }
        }
    }
}

// =====================================
// DRAW NEXT PIECE
// =====================================

function drawNextPiece() {

    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";

    ctx.fillText(
        "NEXT",
        235,
        40
    );

    nextPiece.matrix.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (!value) return;

                    ctx.fillStyle =
                        COLORS[
                            nextPiece.color
                        ];

                    ctx.fillRect(
                        235 + (x * 12),
                        50 + (y * 12),
                        10,
                        10
                    );
                }
            );
        }
    );
}

// =====================================
// DRAW
// =====================================

function drawTetris() {

   
    ctx.fillStyle = "#9bbc0f";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // HUD

    ctx.fillStyle = "#000";

    ctx.font = "10px Arial";

    ctx.fillText(
        `SCORE`,
        235,
        120
    );

    ctx.fillText(
        `${tetrisScore}`,
        235,
        135
    );

    ctx.fillText(
        `LEVEL`,
        235,
        170
    );

    ctx.fillText(
        `${tetrisLevel}`,
        235,
        185
    );

    ctx.fillText(
        `LINES`,
        235,
        220
    );

    ctx.fillText(
        `${tetrisLines}`,
        235,
        235
    );

    ctx.fillText(
        `BEST`,
        235,
        270
    );

    ctx.fillText(
        `${
            localStorage.getItem(
                "tetrisHighScore"
            ) || 0
        }`,
        235,
        285
    );

    drawNextPiece();

    // PLAYFIELD BORDER

ctx.strokeStyle = "#000";
ctx.lineWidth = 2;

ctx.strokeRect(
    71,
    12,
    COLS * BLOCK + 0,
    ROWS * BLOCK
);

/* ctx.strokeStyle = "rgba(0,0,0,0.15)";
ctx.lineWidth = 1;

for(let x = 0; x <= COLS; x++){

    ctx.beginPath();

    ctx.moveTo(
        75 + x * BLOCK,
        12
    );

    ctx.lineTo(
        75 + x * BLOCK,
        ROWS * BLOCK
    );

    ctx.stroke();
}

for(let y = 0; y <= ROWS; y++){

    ctx.beginPath();

    ctx.moveTo(
        75,
        y * BLOCK
    );

    ctx.lineTo(
        75 + COLS * BLOCK,
        y * BLOCK
    );

    ctx.stroke();
}
*/
    // BOARD

    for (
        let y = 0;
        y < ROWS;
        y++
    ) {

        for (
            let x = 0;
            x < COLS;
            x++
        ) {

            const value =
                tetrisBoard[y][x];

            if (!value) continue;

            ctx.fillStyle =
                COLORS[value];

            ctx.fillRect(
                x * BLOCK + 70,
                y * BLOCK + 15,
                BLOCK - 1,
                BLOCK - 1
            );
        }
    }

    // CURRENT PIECE

    currentPiece.matrix.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (!value) return;

                    ctx.fillStyle =
                        COLORS[
                            currentPiece.color
                        ];

                    ctx.fillRect(
                        (currentPiece.x + x)
                        * BLOCK + 70,

                        (currentPiece.y + y)
                        * BLOCK + 15,

                        BLOCK - 1,
                        BLOCK - 1
                    );
                }
            );
        }
    );

    // GAME OVER

    if (tetrisGameOver) {

        ctx.fillStyle = "#000";

        ctx.font = "16px Arial";

        ctx.fillText(
            "GAME OVER",
            85,
            140
        );

        ctx.font = "11px Arial";

        ctx.fillText(
            "SPACE RESTART",
            75,
            180
        );

        ctx.fillText(
            "ENTER MENU",
            85,
            210
        );
    }
}

// =====================================
// LOOP
// =====================================

function tetrisGameLoop() {

    tetrisFrame++;

    if (
        tetrisFrame %
        dropSpeed === 0
    ) {

        updateTetris();
    }

    drawTetris();
}

// =====================================
// INPUTS
// =====================================

document.addEventListener(
    "keydown",
    event => {

        if (
            currentState !==
            GAME_STATE.TETRIS
        ) {
            return;
        }

        // GAME OVER

        if (
            tetrisGameOver &&
            event.code === "Enter"
        ) {

            initTetris();

            return;
        }

        if (
            tetrisGameOver &&
            event.key === " "
        ) {

             if (typeof selectedGame !== "undefined") {
            selectedGame = 0;
        }

            currentState =
                GAME_STATE.MENU;

            return;
        }

        // MOVE LEFT

        if (
            event.key === "ArrowLeft"
        ) {

            currentPiece.x--;

            if (
                collision()
            ) {

                currentPiece.x++;
            }
        }

        // MOVE RIGHT

        if (
            event.key === "ArrowRight"
        ) {

            currentPiece.x++;

            if (
                collision()
            ) {

                currentPiece.x--;
            }
        }

        // SOFT DROP

        if (
            event.key === "ArrowDown"
        ) {

            updateTetris();
        }

        // ROTATE

        if (
            event.key === "ArrowUp"
        ) {

            rotatePiece();
        }

        // HARD DROP

        if (
            event.code === " " &&
            !tetrisGameOver
        ) {

            while (
                !collision()
            ) {

                currentPiece.y++;
            }

            currentPiece.y--;

            updateTetris();
        }
    }
);