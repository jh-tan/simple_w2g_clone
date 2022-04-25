package websocket

type Pool struct {
	Register         chan *Client
	Unregister       chan *Client
	Clients          map[*Client]bool
	Broadcast        chan Message
	CurrentVideo     string
	CurrentTimestamp string
}

func NewPool() *Pool {
	return &Pool{
		Register:         make(chan *Client),
		Unregister:       make(chan *Client),
		Clients:          make(map[*Client]bool),
		Broadcast:        make(chan Message),
		CurrentVideo:     "",
		CurrentTimestamp: "",
	}
}
