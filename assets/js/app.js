// ======================================
// BOOT SCREEN
// ======================================

let bootCounter = 0;
let startupPlayed = false;

const logo = new Image();
logo.src = "image/logo.svg";

// ======================================
// DRAW BOOT SCREEN
// ======================================

function drawBoot() {

    ctx.fillStyle = "#9bbc0f";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (logo.complete) {

        ctx.drawImage(
            logo,
            70,
            40,
            400,
            150
        );
    }

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";

    ctx.fillText(
        "POWERING ON...",
        100,
        250
    );

    if (
        typeof playSound === "function" &&
        !startupPlayed
    ) {

        startupPlayed = true;

        playSound("startup");
    }

    bootCounter++;

    if (bootCounter >= 90) {
        currentState = GAME_STATE.MENU;
    }
    gameTitle.textContent =
    "BOOT";

scoreBoard.textContent =
    "LOADING";
    
}

// ======================================
// MAIN LOOP
// ======================================

function mainLoop() {

    switch(currentState){

    case GAME_STATE.BOOT:

        drawBoot();
        break;

    case GAME_STATE.MENU:

        drawMenu();
        break;

    case GAME_STATE.SNAKE:

        gameLoop();
        break;

    case GAME_STATE.TETRIS:

        tetrisGameLoop();
        break;
}


}

// ======================================
// START
// ======================================

updateHighScore();

setInterval(
    mainLoop,
    1000 / 30
);