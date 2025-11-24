package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Upgrade HTTP → WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// allow all origins for now (for dev)
		return true
	},
}

// track all connected clients
var (
	clients   = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex
)

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// upgrade connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return
	}

	clientsMu.Lock()
	clients[conn] = true
	clientsMu.Unlock()

	log.Println("client connected, total:", len(clients))

	defer func() {
		clientsMu.Lock()
		delete(clients, conn)
		clientsMu.Unlock()
		conn.Close()
		log.Println("client disconnected, total:", len(clients))
	}()

	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("read error:", err)
			break
		}

		// broadcast to all other clients
		clientsMu.Lock()
		for c := range clients {
			if c == conn {
				continue
			}
			if err := c.WriteMessage(msgType, msg); err != nil {
				log.Println("write error:", err)
			}
		}
		clientsMu.Unlock()
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)

	log.Println("whiteboard WebSocket server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
