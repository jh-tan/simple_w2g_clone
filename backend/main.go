package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
	"w2g/backend/websocket"
)

var allLetters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
var allRoom = make(map[string]*websocket.Pool)

type Code struct {
	RandomCode string `json:"Code"`
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

func randomString(n int, alphabet []rune) string {
	alphabetSize := len(alphabet)
	var sb strings.Builder

	for i := 0; i < n; i++ {
		ch := alphabet[rand.Intn(alphabetSize)]
		sb.WriteRune(ch)
	}
	return sb.String()
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func test(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	fmt.Fprintf(w, "Welcome to the HomePage!")
	fmt.Println("Endpoint Hit: homePage")
}

func apicreateroom(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	var code string
	for {
		code = randomString(20, allLetters)
		if _, ok := allRoom[code]; ok {
			continue
		} else {
			allRoom[code] = pool
			break
		}
	}
	fmt.Fprintf(w, code)
}

func getRoom(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	p := strings.Split(r.URL.Path, "/")
	switch len(p) {
	case 2:
		fmt.Fprintf(w, "Rooms code is empty")
	case 3:
		if _, ok := allRoom[p[2]]; !ok {
			w.WriteHeader(http.StatusNotFound)
		} else {
			fmt.Fprintf(w, "%v", p[2])
		}
	}
}

func wsEndpoint(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Println(err)
	}
	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}
	pool.Register <- client
	client.Read()

	//fmt.Println("Client Connected")
}

func handleRequests() {

	http.HandleFunc("/", test)
	//http.HandleFunc("/api-create-room", apicreateroom)
	http.HandleFunc("/api-create-room", func(w http.ResponseWriter, r *http.Request) {
		// Create a new pool whenever someone create a new room
		pool := websocket.NewPool()
		go pool.Start()
		apicreateroom(pool, w, r)
	})
	// Create another API to check if the room is existed
	http.HandleFunc("/rooms/", getRoom)
	http.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		code := strings.Split(r.URL.Path, "/")[2]
		// Get the exist pool based on the room code
		pool := allRoom[code]
		wsEndpoint(pool, w, r)
	})
}

func main() {
	handleRequests()
	log.Println("Now server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}
