📝 Collaborative Real-Time Whiteboard
A modern, real-time, browser-based collaborative whiteboard built with React, WebSockets, and a Go backend, designed for fast, smooth drawing and instant synchronization across multiple users.
This project also includes a polished UI with tools, fullscreen mode, and real-time communication powered by Docker-based deployment.
________________________________________
🚀 Live Collaboration — Instantly
This project allows multiple users to draw together on the same whiteboard in real time.
Every brush stroke is shared instantly using WebSockets, making it perfect for:
•	Remote collaboration
•	Online tutoring
•	Team brainstorming
•	Quick sketching
•	Interactive demos
________________________________________
🎨 Features
✔ Real-time Drawing
Every stroke is streamed to all connected users with WebSockets (Go backend).
✔ Beautiful Modern UI
Clean toolbar with tools, color picker, and brush size slider.
✔ Drawing Tools
•	✏️ Draw tool
•	🧽 Eraser
•	🎚 Adjustable brush size
•	🎨 Color picker
✔ Fullscreen Canvas
Canvas automatically resizes to fill the entire screen.
Works on any device & browser.
✔ Thick Canvas Border
Customizable border for clean visual separation.
✔ Clear Board
Wipe the whiteboard instantly.
✔ Auto-Reconnect WebSocket Status
Live connection badge (Connected / Disconnected).
________________________________________
🧩 Tech Stack
Frontend
•	React (Vite)
•	HTML5 Canvas
•	Modern CSS & custom styling
Backend
•	Go (Golang)
•	Gorilla WebSocket
Infrastructure
•	Docker & Docker Compose
•	AWS EC2 deployment
•	NGINX for serving production frontend
________________________________________
🏗 Project Structure
Collaborative Whiteboard/
│
├── client-react/        # React frontend (Vite)
│   ├── src/App.jsx
│   ├── Dockerfile
│   └── ...
│
├── server-go/           # Go WebSocket server
│   ├── main.go
│   ├── Dockerfile
│   └── ...
│
└── docker-compose.yml   # Multi-container deployment
________________________________________
🐳 Docker Deployment
Start everything with:
docker compose up --build -d
This launches:
•	Frontend on port 3000
•	Go WebSocket server on port 8080
Open:
http://localhost:3000
________________________________________
☁️ AWS Deployment (EC2)
This project includes a full AWS-ready configuration:
•	EC2 Ubuntu Server
•	Docker + Docker Compose
•	Public access to frontend & WebSocket server
•	Fully working globally
Once deployed, anyone can access:
http://YOUR-EC2-IP:3000
________________________________________
🧠 How It Works
1.	The React app listens for mouse movement on the canvas.
2.	Each stroke is drawn locally AND sent over WebSocket.
3.	The Go server broadcasts strokes to all connected clients.
4.	All clients draw the received strokes instantly.
5.	Canvas auto-resizes to fullscreen while preserving drawings.
k________________________________________
💡 Future Improvements
•	User cursors (live pointer tracking)
•	Undo / Redo
•	Save whiteboard as PNG
•	Multiple rooms (whiteboard/123, whiteboard/team)
•	Authentication
•	Dark mode toggle
