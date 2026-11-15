let selectedGame = 0;
const gameTitleElement = document.getElementById("game-title");

const games = [
    {
        title: "PLAY SNAKE",
        id: "snake"
    },
    {
        title: "PLAY TETRIS",
        id: "tetris"
    }
];

function drawMenu() {
    

    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";

    ctx.fillText(
    "PLAY GAME",
    70,
    50
);

    games.forEach((game, index) => {

        const pointer =
            index === selectedGame
            ? ">"
            : " ";
        ctx.font="20px Arial";
        ctx.fillText(
            `${pointer} ${game.title}`,
            70,
            120 + (index * 40)
        );
    });
    ctx.font = "12px Arial";
    ctx.fillText("ENTER TO START", 100, 250);
}


document.addEventListener("keydown", (event) => {

    if (currentState !== GAME_STATE.MENU)
         return;

    if (event.key === "ArrowDown") {
        selectedGame =
            (selectedGame + 1) % games.length;
        playSound("move");
    }

    if (event.key === "ArrowUp") {
        selectedGame =
            (selectedGame - 1 + games.length) %
            games.length;
        playSound("move");
    }

    if (event.key === "Enter") {

        if (games[selectedGame].id === "snake") {

            initGame();

            currentState = GAME_STATE.SNAKE;
            gameTitleElement.textContent = "SNAKE";
        }

        if (games[selectedGame].id === "tetris") {

            initTetris();

            currentState = GAME_STATE.TETRIS;
            gameTitleElement.textContent = "TETRIS";
        }
        playSound("select");
    }
});