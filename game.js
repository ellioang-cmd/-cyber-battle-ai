
"use strict";

// Cyber Battle: Human vs AI

let playerHealth = 100;
let aiHealth = 100;
let gameOver = false;
let turn = 0;
let playerHistory = [];

const playerHealthText = document.getElementById("player-health");
const aiHealthText = document.getElementById("ai-health");
const playerHealthBar = document.getElementById("player-health-bar");
const aiHealthBar = document.getElementById("ai-health-bar");
const gameMessage = document.getElementById("game-message");

const attackBtn = document.getElementById("attack-btn");
const defendBtn = document.getElementById("defend-btn");
const healBtn = document.getElementById("heal-btn");
const restartBtn = document.getElementById("restart-btn");

function updateDisplay() {
  playerHealthText.textContent = playerHealth;
  aiHealthText.textContent = aiHealth;

  playerHealthBar.style.width = playerHealth + "%";
  aiHealthBar.style.width = aiHealth + "%";
}

// AI analyzes previous human moves.
function chooseAIAction() {
  const recentMoves = playerHistory.slice(-3);

  const attacks = recentMoves.filter(
    move => move === "attack"
  ).length;

  const heals = recentMoves.filter(
    move => move === "heal"
  ).length;

  // AI prioritizes survival when health is low.
  if (aiHealth <= 30 && Math.random() < 0.7) {
    return "heal";
  }

  // Counter repeated human attacks.
  if (attacks >= 2) {
    return "defend";
  }

  // Attack when the human frequently restores health.
  if (heals >= 2) {
    return "attack";
  }

  // Otherwise select a strategic action.
  const choices = ["attack", "attack", "defend", "heal"];
  return choices[Math.floor(Math.random() * choices.length)];
}

function playTurn(playerAction) {
  if (gameOver) return;

  turn++;
  const aiAction = chooseAIAction();

  let message = "Turn " + turn + ": ";

  // Resolve the human player's action.
  if (playerAction === "attack") {
    let damage = 20;

    if (aiAction === "defend") {
      damage = 5;
    }

    aiHealth = Math.max(0, aiHealth - damage);
    message += "You attacked the AI for " + damage + " damage. ";
  }

  if (playerAction === "heal") {
    const healed = Math.min(15, 100 - playerHealth);
    playerHealth += healed;
    message += "You restored " + healed + " health. ";
  }

  if (playerAction === "defend") {
    message += "You activated your firewall. ";
  }

  // Resolve the AI opponent's action.
  if (aiHealth > 0) {
    if (aiAction === "attack") {
      const damage = playerAction === "defend" ? 5 : 18;
      playerHealth = Math.max(0, playerHealth - damage);
      message += "AI attacked for " + damage + " damage.";
    }

    if (aiAction === "defend") {
      message += "AI activated its defense system.";
    }

    if (aiAction === "heal") {
      const healed = Math.min(12, 100 - aiHealth);
      aiHealth += healed;
      message += "AI restored " + healed + " health.";
    }
  }

  playerHistory.push(playerAction);
  updateDisplay();

  // Determine the winner.
  if (aiHealth <= 0) {
    gameOver = true;
    message += " YOU WIN! The AI hacker was defeated!";
  } else if (playerHealth <= 0) {
    gameOver = true;
    message += " GAME OVER! The AI hacker wins!";
  }

  if (gameOver) {
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    healBtn.disabled = true;
  }

  gameMessage.textContent = message;
}

function restartGame() {
  playerHealth = 100;
  aiHealth = 100;
  gameOver = false;
  turn = 0;
  playerHistory = [];

  attackBtn.disabled = false;
  defendBtn.disabled = false;
  healBtn.disabled = false;

  gameMessage.textContent = "The cyber battle is ready!";
  updateDisplay();
}

// Connect buttons to game actions.
attackBtn.addEventListener("click", () => playTurn("attack"));
defendBtn.addEventListener("click", () => playTurn("defend"));
healBtn.addEventListener("click", () => playTurn("heal"));
restartBtn.addEventListener("click", restartGame);

updateDisplay();
