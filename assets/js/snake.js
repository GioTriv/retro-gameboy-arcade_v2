const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("high-score");

const tileSize = 15;
const tileCount = 20;

let snake;
let food;

let dx;
let dy;

let score;
let gameOver;

let frameCount = 0;

const gameSpeed = 4;

// ======================================
// INIT
// ======================================

function initGame() {

    snake = [
        {
            x: 10,
            y: 10
        }
    ];

    dx = 1;
    dy = 0;

    score = 0;

    gameOver = false;

    frameCount = 0;

    food = createFood();

    scoreElement.textContent =
        score;
}

// ======================================
// FOOD
// ======================================

function createFood() {

    return {

        x: Math.floor(
            Math.random() *
            tileCount
        ),

        y: Math.floor(
            Math.random() *
            tileCount
        )
    };
}

// ======================================
// DRAW TILE
// ======================================

function drawTile(
    x,
    y,
    color
) {

    ctx.fillStyle = color;

    ctx.fillRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
    );
}

// ======================================
// UPDATE GAME
// ======================================

function update() {

    if (gameOver) return;

    const head = {

        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // collision wall

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ) {

        endGame();
        return;
    }

    // collision self

    for (let segment of snake) {

        if (
            head.x === segment.x &&
            head.y === segment.y
        ) {

            endGame();
            return;
        }
    }

    snake.unshift(head);

    // eat food

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        scoreElement.textContent =
            score;

        food = createFood();

        saveHighScore();

        if (
            typeof playSound ===
            "function"
        ) {

            playSound("eat");
        }

    } else {

        snake.pop();
    }
}

// ======================================
// DRAW GAME
// ======================================

function draw() {

    ctx.fillStyle = "#9bbc0f";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // food

    drawTile(
        food.x,
        food.y,
        "#1f2f06"
    );

    // snake

    snake.forEach(segment => {

        drawTile(
            segment.x,
            segment.y,
            "#000"
        );
    });

    if (gameOver) {

        ctx.fillStyle = "#000";

        ctx.font = "20px Arial";

        ctx.fillText(
            "GAME OVER",
            70,
            100
        );

        ctx.font = "12px Arial";

        ctx.fillText(
            "ENTER RESTART",
            80,
            160
        );

        ctx.fillText(
            "SPACE MENU",
            90,
            200
        );
    }
}

// ======================================
// LOOP
// ======================================

function gameLoop() {

    frameCount++;

    if (
        frameCount %
        gameSpeed === 0
    ) {

        update();
    }

    draw();
}

// ======================================
// GAME OVER
// ======================================

function endGame() {

    gameOver = true;

    if (
        typeof playSound ===
        "function"
    ) {

        playSound(
            "game-over"
        );
    }
}

// ======================================
// HIGHSCORE
// ======================================

function saveHighScore() {

    const currentHighScore = 

        Number(
            localStorage.getItem(
                "snakeHighScore"
            )
        ) || 0;

    if (
        score >
        currentHighScore
    ) {

        localStorage.setItem(
            "snakeHighScore",
            score
        );

        updateHighScore();
    }
}

function updateHighScore() {

    highScoreElement.textContent =

        localStorage.getItem(
            "snakeHighScore"
        ) || 0;
}

// ======================================
// INPUTS
// ======================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            currentState !==
            GAME_STATE.SNAKE
        ) {
            return;
        }

        // MENU AFTER GAME OVER
          // RESTART

        if (
            gameOver &&
            event.code === "Enter"
        ) {

            initGame();

            return;
        }

        if (
            gameOver &&
            event.key === " "
        ) {

        if (typeof selectedGame !== "undefined") {
            selectedGame = 0;
        }

        currentState =
        GAME_STATE.MENU;

    return;
}

         // MOVEMENT

        if (
            event.key === "ArrowUp" &&
            dy === 0
        ) {

            dx = 0;
            dy = -1;
        }

        if (
            event.key === "ArrowDown" &&
            dy === 0
        ) {

            dx = 0;
            dy = 1;
        }

        if (
            event.key === "ArrowLeft" &&
            dx === 0
        ) {

            dx = -1;
            dy = 0;
        }

        if (
            event.key === "ArrowRight" &&
            dx === 0
        ) {

            dx = 1;
            dy = 0;
        }
    }
);