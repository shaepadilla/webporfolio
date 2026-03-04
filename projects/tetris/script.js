const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

let board = createBoard();
let score = 0;
let level = 1;

let dropInterval = 400; // start fast
let maxDropInterval = 1200; // slowest
let levelTimer = 120; // 2 minutes
let timerInterval;

let lastTime = 0;
let dropCounter = 0;

const colors = [
    null,
    "#00f0f0",
    "#0000f0",
    "#f0a000",
    "#f0f000",
    "#00f000",
    "#a000f0",
    "#f00000"
];

const pieces = [
    [],
    [[1,1,1,1]],
    [[2,0,0],[2,2,2]],
    [[0,0,3],[3,3,3]],
    [[4,4],[4,4]],
    [[0,5,5],[5,5,0]],
    [[0,6,0],[6,6,6]],
    [[7,7,0],[0,7,7]]
];

let player = {
    pos: {x: 0, y: 0},
    matrix: null
};

function createBoard() {
    return Array.from({length: ROWS}, () => Array(COLS).fill(0));
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(x, y, colors[value]);
            }
        });
    });

    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(x + player.pos.x, y + player.pos.y, colors[value]);
            }
        });
    });
}

function merge() {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide() {
    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < player.matrix[y].length; x++) {
            if (
                player.matrix[y][x] !== 0 &&
                (board[y + player.pos.y] &&
                board[y + player.pos.y][x + player.pos.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide()) {
        player.pos.y--;
        merge();
        clearLines();
        playerReset();
    }
}

function playerHardDrop() {
    while (!collide()) player.pos.y++;
    player.pos.y--;
    merge();
    clearLines();
    playerReset();
}

function clearLines() {
    let linesCleared = 0;

    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) continue outer;
        }
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
    }

    if (linesCleared > 0) {
        score += linesCleared * 5;
    }

    document.getElementById("score").innerText = score;

    checkLevelUp();
}

function checkLevelUp() {
    const requiredScore = level * 15;

    if (score >= requiredScore) {
        level++;
        startLevel();
    }
}

function startLevel() {
    levelTimer = 120;
    dropInterval = 400; // reset to fast start

    document.getElementById("level").innerText = level;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        levelTimer--;

        // Gradually slow blocks
        dropInterval = Math.min(maxDropInterval, dropInterval + 7);

        document.getElementById("timer").innerText = levelTimer;

        if (levelTimer <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Game Over.");
            resetGame();
        }

    }, 1000);
}

function resetGame() {
    board = createBoard();
    score = 0;
    level = 1;
    dropInterval = 400;

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("timer").innerText = 120;

    startLevel();
    playerReset();
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide()) player.pos.x -= dir;
}

function rotate(matrix) {
    return matrix[0].map((_, i) =>
        matrix.map(row => row[i]).reverse()
    );
}

function playerRotate() {
    const rotated = rotate(player.matrix);
    const old = player.matrix;
    player.matrix = rotated;
    if (collide()) player.matrix = old;
}

function playerReset() {
    const rand = Math.floor(Math.random() * (pieces.length - 1)) + 1;
    player.matrix = pieces[rand];
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);

    if (collide()) {
        alert("Game Over");
        resetGame();
    }
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        playerDrop();
        dropCounter = 0;
    }

    draw();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") playerMove(-1);
    if (e.key === "ArrowRight") playerMove(1);
    if (e.key === "ArrowDown") playerDrop();
    if (e.key === "ArrowUp") playerRotate();
    if (e.code === "Space") playerHardDrop();
});

document.getElementById("newGameBtn").addEventListener("click", resetGame);

playerReset();
startLevel();
update();