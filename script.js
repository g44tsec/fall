const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Basket properties
const basket = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 120,
    height: 60,
    baseSpeed: 8,
    speed: 8,
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false
};

// Array to hold multiple leaves
let leaves = [
    {
        x: Math.random() * (canvas.width / 3) + canvas.width / 3,
        y: -30,
        width: 30,
        height: 30,
        speed: 0.5 + Math.random() * 0.5
    }
];

let score = 0; // Start with 0 score
const leavesToAdd = 2; // Number of leaves to add every 10 points

// DOM Elements
const scoreDisplay = document.getElementById('score');
scoreDisplay.innerText = score;

// Handle basket movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') basket.moveLeft = true;
    if (e.key === 'ArrowRight') basket.moveRight = true;
    if (e.key === 'ArrowUp') basket.moveUp = true;
    if (e.key === 'ArrowDown') basket.moveDown = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') basket.moveLeft = false;
    if (e.key === 'ArrowRight') basket.moveRight = false;
    if (e.key === 'ArrowUp') basket.moveUp = false;
    if (e.key === 'ArrowDown') basket.moveDown = false;
});

// Function to synchronize leaves based on score
function synchronizeLeaves() {
    while (leaves.length < score) {
        leaves.push({
            x: Math.random() * (canvas.width / 3) + canvas.width / 3,
            y: -30,
            width: 30,
            height: 30,
            speed: 0.5 + Math.random() * 0.5
        });
    }
}

// Function to collect leaf
function collectLeaf(leafIndex) {
    score++; // Increment score by 1
    scoreDisplay.innerText = score; // Update score display

    // Check if score is a multiple of 10
    if (score % 10 === 0) {
        // Add 2 leaves when score is a multiple of 10
        for (let i = 0; i < leavesToAdd; i++) {
            leaves.push({
                x: Math.random() * (canvas.width / 3) + canvas.width / 3,
                y: -30,
                width: 30,
                height: 30,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }

    // Remove the collected leaf
    leaves.splice(leafIndex, 1);
    synchronizeLeaves(); // Synchronize leaves based on the updated score
}

// Drop leaf and lose the game
function dropLeaf() {
    alert("You dropped a leaf! Game Over.");
    resetGame();
}

// Reset the game
function resetGame() {
    score = 0; // Reset score to 0
    leaves = [
        {
            x: Math.random() * (canvas.width / 3) + canvas.width / 3,
            y: -30,
            width: 30,
            height: 30,
            speed: 0.5 + Math.random() * 0.5
        }
    ];
    scoreDisplay.innerText = score; // Reset score display
}

// Update leaves' positions and detect collection
function updateLeaves() {
    for (let i = leaves.length - 1; i >= 0; i--) {
        let leaf = leaves[i];
        leaf.y += leaf.speed;

        // Leaf collection detection
        if (
            leaf.x < basket.x + basket.width &&
            leaf.x + leaf.width > basket.x &&
            leaf.y < basket.y + basket.height &&
            leaf.y + leaf.height > basket.y
        ) {
            collectLeaf(i);
        } else if (leaf.y > canvas.height) {
            dropLeaf();
            return;
        }

        // Draw leaf with white outline
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(leaf.x, leaf.y, leaf.width, leaf.height);
        ctx.drawImage(document.getElementById('leaf'), leaf.x, leaf.y, leaf.width, leaf.height);
        ctx.restore();
    }
}

// Update and draw basket
function moveBasket() {
    if (basket.moveLeft && basket.x > 0) basket.x -= basket.speed;
    if (basket.moveRight && basket.x + basket.width < canvas.width) basket.x += basket.speed;
    if (basket.moveUp && basket.y > 0) basket.y -= basket.speed;
    if (basket.moveDown && basket.y + basket.height < canvas.height) basket.y += basket.speed;
}

function drawBasket() {
    ctx.fillStyle = '#8B4513'; // Brown basket color
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBasket();
    moveBasket();
    updateLeaves();

    requestAnimationFrame(gameLoop);
}

gameLoop();
