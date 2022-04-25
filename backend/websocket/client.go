package websocket

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Request struct {
	Type int
	Body string
}

type Message struct {
	Type   int             `json:"type"`
	Body   string          `json:"body"`
	Sender *websocket.Conn `json:"sender"`
}

type VideoInfo struct {
	Type      int             `json:"type"`
	URL       string          `json:"body"`
	Timestamp string          `json:"timestamp"`
	Sender    *websocket.Conn `json:"sender"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		//messageType, p, err := c.Conn.ReadMessage()

		var request Request
		err := c.Conn.ReadJSON(&request)
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Println(1, request.Type)
		fmt.Println(2, request.Body)

		if request.Type == 2 {
			c.Pool.CurrentVideo = request.Body
		} else if request.Type == 4 {
			c.Pool.CurrentTimestamp = request.Body
		}
		message := Message{Type: request.Type, Body: string(request.Body), Sender: c.Conn}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			newJoiner := client
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				if newJoiner.Conn == client.Conn && newJoiner.Pool.CurrentVideo != "" {
					// Send the new joiner the currently playing video
					client.Conn.WriteJSON(VideoInfo{Type: 2, URL: newJoiner.Pool.CurrentVideo, Timestamp: newJoiner.Pool.CurrentTimestamp})
					continue
				}
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
			}
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
			}
			break
		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				fmt.Println("CHECK CLIENT", client)
				if message.Sender == client.Conn {
					continue
				}
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
