import { useEffect, useRef, useState } from "react";
import "../App.css";

const FIELDS_NUMBER = 12;

function Canvas() {
  const [gameOver, setGameOver] = useState(false);
  const snakeRef = useRef([
    [5, 5],
    [5, 5],
    [5, 5],
  ]);
  const canvasRef = useRef(null);
  const dirRef = useRef([0, -1]);
  const foodRef = useRef([0, 0]);
  const intervalRef = useRef(null);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cellSize = canvas.width / FIELDS_NUMBER;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snakeRef.current.forEach((el) => drawSnakePart(ctx, cellSize, el));

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
    const startX = part[0] * cellSize;
    const startY = part[1] * cellSize;
    ctx.rect(startX, startY, cellSize, cellSize);
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

    return newFood;
  }

  function gameLoop() {
    if (!canvasRef) return;
    const eaten = foodCollision();
    const [dx, dy] = [...dirRef.current];
    const copiedSnake = JSON.parse(JSON.stringify(snakeRef.current));
    if (!eaten) copiedSnake.pop();
    if (eaten) {
      foodRef.current = createFood(copiedSnake);
    }
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
    // gameLoop();
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

  function foodCollision() {
    return snakeRef.current[0][0] == foodRef.current[0] &&
      snakeRef.current[0][1] == foodRef.current[1]
      ? true
      : false;
  }

  function snakeCollision(copiedSnake) {
    const snakeTail = JSON.parse(JSON.stringify(copiedSnake));
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
    let id;

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
      <canvas ref={canvasRef} className="board"></canvas>
    </div>
  );
}

export default Canvas;
