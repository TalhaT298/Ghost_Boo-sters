// Game variables
let timer = 20;
let found = 0;
const totalGhosts = 5;
let gameInterval;

// DOM elements
const timerDisplay = document.getElementById("timer");
const foundDisplay = document.getElementById("found");
const totalDisplay = document.getElementById("total");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameArea = document.getElementById("game-area");
const ghosts = document.querySelectorAll(".ghost");
const flashlight = document.getElementById("flashlight");

// Function to place ghosts randomly
function placeGhostsRandomly() {
  const gameWidth = gameArea.offsetWidth;
  const gameHeight = gameArea.offsetHeight;
  const ghostSize = 40; // Size of each ghost

  // Array to store occupied positions
  const occupiedPositions = [];

  ghosts.forEach((ghost) => {
    let newLeft, newTop;
    let overlapping;

    do {
      overlapping = false;

      // Randomly place the ghost
      newLeft = Math.random() * (gameWidth - ghostSize);
      newTop = Math.random() * (gameHeight - ghostSize);

      // Check if the new position overlaps with any occupied position
      for (const pos of occupiedPositions) {
        const distance = Math.sqrt(
          Math.pow(newLeft - pos.left, 2) + Math.pow(newTop - pos.top, 2)
        );

        // If the distance is less than the ghost size, they overlap
        if (distance < ghostSize) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping); // Repeat until no overlap

    // Save the new position
    occupiedPositions.push({ left: newLeft, top: newTop });

    // Set the ghost's position
    ghost.style.left = `${newLeft}px`;
    ghost.style.top = `${newTop}px`;
    ghost.style.opacity = "0"; // Ghosts are invisible by default
    ghost.addEventListener("click", bustGhost, { once: true }); // Only listen for one click
  });
}

// Initialize game
function startGame() {
  // Reset game state
  timer = 20;
  found = 0;
  timerDisplay.textContent = timer;
  foundDisplay.textContent = found;
  totalDisplay.textContent = totalGhosts;

  // Hide start button and show restart button
  startButton.classList.add("hidden");
  restartButton.classList.remove("hidden");

  // Place ghosts randomly
  placeGhostsRandomly();

  // Show flashlight
  flashlight.style.display = "block";

  // Start timer
  gameInterval = setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
  timer--;
  timerDisplay.textContent = timer;

  // Check if time runs out
  if (timer <= 0) {
    endGame(false);
  }
}

// Bust a ghost
function bustGhost(event) {
  const ghost = event.target;

  // Make the ghost vanish completely
  ghost.style.display = "none"; // Hide the ghost entirely

  // Increase the found count
  found++;
  foundDisplay.textContent = found;

  // Check if all ghosts are busted
  if (found === totalGhosts) {
    endGame(true);
  }
}

// End game
function endGame(isWin) {
  clearInterval(gameInterval);
  alert(isWin ? "You won! All ghosts busted!" : "Game over! Time's up!");
  restartButton.classList.remove("hidden");
  flashlight.style.display = "none"; // Hide flashlight
}

// Restart game
restartButton.addEventListener("click", () => {
  ghosts.forEach(ghost => {
    ghost.style.display = "block"; // Show ghosts again
    ghost.style.opacity = "0"; // Make them invisible
  });
  startGame();
});

// Start game on button click
startButton.addEventListener("click", startGame);

// Flashlight effect
gameArea.addEventListener("mousemove", (e) => {
  // Calculate the position of the flashlight
  const mouseX = e.clientX - gameArea.getBoundingClientRect().left;
  const mouseY = e.clientY - gameArea.getBoundingClientRect().top;

  // Move the flashlight to the mouse position
  flashlight.style.left = `${mouseX}px`;
  flashlight.style.top = `${mouseY}px`;

  // Check if flashlight is over a ghost
  ghosts.forEach(ghost => {
    if (ghost.style.display !== "none") { // Only check visible ghosts
      const ghostRect = ghost.getBoundingClientRect();
      const flashlightRect = flashlight.getBoundingClientRect();

      if (
        ghostRect.left < flashlightRect.right &&
        ghostRect.right > flashlightRect.left &&
        ghostRect.top < flashlightRect.bottom &&
        ghostRect.bottom > flashlightRect.top
      ) {
        ghost.style.opacity = "1"; // Make ghost visible
      } else {
        ghost.style.opacity = "0"; // Make ghost invisible
      }
    }
  });
});