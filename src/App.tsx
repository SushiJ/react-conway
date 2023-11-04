import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import "./App.css";

const ROWS = 50;
const COLS = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];

    for (let i = 0; i < ROWS; ++i) {
      rows.push(Array.from(Array(COLS), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSim = useCallback(() => {
    if (!runningRef) return;

    setTimeout(runSim, 1000);
  }, []);
  return (
    <>
      <button onClick={() => setRunning(!running)}>
        {running ? "Stop" : "Start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          placeContent: "center",
          placeItems: "center",
          height: "auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
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
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          )),
        )}
      </div>
    </>
  );
}

export default App;