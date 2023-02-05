import { useEffect, useRef, useState } from "react";
import "../App.css";
import Popup from "./Popup";

const FIELDS_NUMBER = 12;

const INITIAL_SNAKE = [
  [5, 5],
  [5, 5],
  [5, 5],
];

const INITIAL_DIR = [0, -1];

function Game() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const snakeRef = useRef(INITIAL_SNAKE);
  const canvasRef = useRef(null);
  const dirRef = useRef([0, -1]);
  const foodRef = useRef(null);
  const intervalRef = useRef(null);

  function reset() {
    snakeRef.current = INITIAL_SNAKE;
    dirRef.current = INITIAL_DIR;
    foodRef.current = null;
    setScore(0);
    setGameOver(false);
    console.log("reset");
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cellSize = canvas.width / FIELDS_NUMBER;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw snake
    snakeRef.current.forEach((el) => drawSnakePart(ctx, cellSize, el));

    //draw food
    if (!foodRef.current) createFood(snakeRef.current);
    ctx.fillStyle = "red";
    ctx.fillRect(
      foodRef.current[0] * cellSize,
      foodRef.current[1] * cellSize,
      cellSize,
      cellSize
    );
  }

  function drawSnakePart(ctx, cellSize, part) {
    ctx.fillStyle = "#0f0";
    const x = part[0] * cellSize;
    const y = part[1] * cellSize;
    ctx.rect(x, y, cellSize, cellSize);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
  }

  function createFood(copiedSnake) {
    const board2DArr = [...Array(FIELDS_NUMBER * FIELDS_NUMBER).keys()];
    copiedSnake.forEach((part) => {
      let idx = part[1] * FIELDS_NUMBER + part[0];
      board2DArr[idx] = true;
    });

    const allowedFields = board2DArr.filter((el) => el !== true);
    const field =
      allowedFields[Math.floor(Math.random() * allowedFields.length)];

    const newFood = [
      field % FIELDS_NUMBER,
      (field - (field % FIELDS_NUMBER)) / FIELDS_NUMBER,
    ];

    foodRef.current = newFood;
    console.log(foodRef.current);
  }

  function gameLoop() {
    if (!canvasRef) return;
    const [dx, dy] = [...dirRef.current];
    const copiedSnake = JSON.parse(JSON.stringify(snakeRef.current));
    foodCollision(copiedSnake);
    const [x, y] = copiedSnake[0];
    const newHead = [x + dx, y + dy];
    copiedSnake.unshift(newHead);
    checkGameOver(copiedSnake);
    snakeRef.current = copiedSnake;
    draw();
  }

  function changeDir(key) {
    if (key === "ArrowUp" && dirRef.current[1] != 1) {
      dirRef.current = [0, -1];
    }

    if (key === "ArrowDown" && dirRef.current[1] != -1) {
      dirRef.current = [0, 1];
    }

    if (key === "ArrowLeft" && dirRef.current[0] != 1) {
      dirRef.current = [-1, 0];
    }

    if (key === "ArrowRight" && dirRef.current[0] != -1) {
      dirRef.current = [1, 0];
    }
  }

  function checkGameOver(snake) {
    if (
      snake[0][0] > 11 ||
      snake[0][0] < 0 ||
      snake[0][1] > 11 ||
      snake[0][1] < 0 ||
      snakeCollision(snake)
    ) {
      console.log(snake[0], "game over, suicide:", snakeCollision(snake));
      setGameOver(true);
    }
  }

  function foodCollision(snake) {
    if (
      snakeRef.current[0][0] == foodRef.current[0] &&
      snakeRef.current[0][1] == foodRef.current[1]
    ) {
      createFood(snake);
      setScore((prev) => prev + 1);
    } else {
      snake.pop();
    }
  }

  function snakeCollision(snake) {
    const snakeTail = JSON.parse(JSON.stringify(snake));
    const snakeHead = snakeTail.shift();
    const collision = snakeTail.some(
      (part) => snakeHead[0] == part[0] && snakeHead[1] == part[1]
    );
    return collision;
  }

  function movementsHandler(e) {
    clearInterval(intervalRef.current);
    changeDir(e.key);
    gameLoop();
    setTimeout(() => {}, 100);
    intervalRef.current = setInterval(
      () => requestAnimationFrame(gameLoop),
      500
    );
  }

  useEffect(() => {
    draw();

    if (!gameOver) {
      window.addEventListener("keydown", movementsHandler);
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("keydown", movementsHandler);
    };
  }, [gameOver]);

  return (
    <div className="App">
      <div className="score">score: {score}</div>
      <canvas ref={canvasRef} className="board"></canvas>
      {gameOver && <Popup reset={reset} />}
    </div>
  );
}

export default Game;
