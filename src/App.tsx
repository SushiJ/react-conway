import { useCallback, useRef, useState } from "react";
import { produce } from "immer";

const ROWS = 50;
const COLS = 50;

const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
function generateEmptyGrid() {
  const rows = [];
  for (let i = 0; i < ROWS; ++i) {
    rows.push(Array.from(Array(COLS), () => 0));
  }
  return rows;
}

function generateRandomGrid() {
  const rows: number[][] = [];
  for (let i = 0; i < ROWS; ++i) {
    rows.push(Array.from(Array(COLS), () => (Math.random() > 0.75 ? 1 : 0)));
  }
  return rows;
}

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [grid, setGrid] = useState(() => {
    const rows = [];

    for (let i = 0; i < ROWS; ++i) {
      rows.push(Array.from(Array(COLS), () => 0));
    }
    return rows;
  });

  const runningRef = useRef(running);
  runningRef.current = running;
  console.log(running);

  const runSim = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return produce(g, (gCopy) => {
        for (let i = 0; i < ROWS; ++i) {
          for (let j = 0; j < COLS; ++j) {
            let neighbors = 0;
            DIRECTIONS.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) gCopy[i][j] = 0;
            else if (g[i][j] === 0 && neighbors === 3) gCopy[i][j] = 1;
          }
        }
      });
    });

    setTimeout(runSim, 100);
  }, []);

  return (
    <div
      className="container"
      style={{ maxWidth: "1280", marginBottom: "40px" }}
    >
      <button
        className="outline contrast"
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSim();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        className="contrast outline"
        onClick={() => {
          setGrid(generateRandomGrid);
        }}
      >
        Random
      </button>
      <button
        className="secondary outline"
        onClick={() => {
          setGrid(generateEmptyGrid);
          setRunning(false);
        }}
      >
        Reset
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 21px)`,
          placeContent: "center",
          placeItems: "center",
          height: "auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#d81b60" : undefined,
                border: "solid 1px #2D3138",
              }}
            ></div>
          )),
        )}
      </div>
    </div>
  );
}

export default App;
