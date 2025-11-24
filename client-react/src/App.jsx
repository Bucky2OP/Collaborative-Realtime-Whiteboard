import React, { useEffect, useRef, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const [connected, setConnected] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState("draw"); // draw | erase

  // Resize canvas while keeping drawings
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const snapshot = canvas.toDataURL();

    // Fullscreen canvas height except toolbar region
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 180; // adjust if toolbar grows

    const img = new Image();
    img.src = snapshot;
    img.onload = () => ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    // Ensure canvas exists before resizing
    setTimeout(() => resizeCanvas(), 0);

    window.addEventListener("resize", resizeCanvas);

    // WebSocket connection
    wsRef.current = new WebSocket(
      "ws://" + window.location.hostname + ":8080/ws"
    );

    wsRef.current.onopen = () => setConnected(true);
    wsRef.current.onclose = () => setConnected(false);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      drawLine(
        data.x0,
        data.y0,
        data.x1,
        data.y1,
        data.color,
        data.size,
        false
      );
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => {
    drawing.current = true;
    last.current = getPos(e);
  };

  const stopDraw = () => {
    drawing.current = false;
  };

  const draw = (e) => {
    if (!drawing.current) return;
    const pos = getPos(e);

    const strokeColor = mode === "erase" ? "#FFFFFF" : color;

    drawLine(
      last.current.x,
      last.current.y,
      pos.x,
      pos.y,
      strokeColor,
      brushSize,
      true
    );

    wsRef.current.send(
      JSON.stringify({
        x0: last.current.x,
        y0: last.current.y,
        x1: pos.x,
        y1: pos.y,
        color: strokeColor,
        size: brushSize,
      })
    );

    last.current = pos;
  };

  const drawLine = (x0, y0, x1, y1, strokeColor, size, local) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={styles.page}>
      {/* Title */}
      <div style={{ textAlign: "center", width: "100%" }}>
        <h1 style={styles.title}>📝 Collaborative Whiteboard</h1>

        <p
          style={{
            color: connected ? "lightgreen" : "red",
            marginBottom: "10px",
            fontSize: "18px",
          }}
        >
          Status: {connected ? "Connected" : "Disconnected"}
        </p>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={styles.colorPicker}
        />

        {/* Brush size */}
        <input
          type="range"
          min="1"
          max="30"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={styles.slider}
        />

        {/* Draw */}
        <button
          style={mode === "draw" ? styles.activeBtn : styles.btn}
          onClick={() => setMode("draw")}
        >
          ✏️ Draw
        </button>

        {/* Eraser */}
        <button
          style={mode === "erase" ? styles.activeBtn : styles.btn}
          onClick={() => setMode("erase")}
        >
          🧽 Eraser
        </button>

        {/* Clear */}
        <button style={styles.btn} onClick={clearBoard}>
          🗑 Clear
        </button>
      </div>

      {/* Canvas container */}
      <div style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          style={styles.canvas}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
        />
      </div>
    </div>
  );
}

//
// 🎨 STYLES
//
const styles = {
  page: {
    margin: 0,
    padding: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#efefef",
    overflow: "hidden",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
    background: "black",
    color: "white",
    padding: "10px 25px",
    borderRadius: "12px",
    display: "inline-block",
    marginTop: "10px",
  },

  toolbar: {
    display: "flex",
    gap: "12px",
    background: "white",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "12px",
  },

  colorPicker: {
    width: "40px",
    height: "35px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  slider: {
    width: "150px",
  },

  btn: {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeBtn: {
    padding: "8px 15px",
    borderRadius: "6px",
    background: "#0275ff",
    color: "white",
    cursor: "pointer",
    border: "1px solid #0056c7",
    fontSize: "14px",
  },

  canvasContainer: {
    flexGrow: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  canvas: {
    border: "8px solid black",
    borderRadius: "12px",
    background: "white",
    cursor: "crosshair",
    display: "block",
  },
};

export default App;
