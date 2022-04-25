import Chat from '../components/Chat'
import VideoPlayer from '../components/VideoPlayer'
import Error404 from '../pages/Error'
import ReceiveMessage from '../components/ReceiveMessage'
import {useState, useRef, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'

const Rooms = () => {
    const [url, setUrl] = useState('')
    const [valid, setValidity] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [websocket, setWebsocket] = useState(null)
    const [allMsg, setAllMsg] = useState([])
    const [timestamp, setNewTimestamp] = useState(null)
    const [sync, setSync] = useState(null)

    const location = useLocation()
    const roomCode = location.pathname.split("/")[2]
    const urlRef = useRef('')
    const handleSubmit = (e) => {
        e.preventDefault();
        // Set the current pool's video 
        websocket.send(JSON.stringify({
            type: 2,
            body: urlRef.current.value
        }))
        setUrl(urlRef.current.value)
        urlRef.current.value = ""
    }

    const checkRoom = async () => {
        try {
            await axios.get(`http://localhost:8080/rooms/${roomCode}`)
            setValidity(true)
            setLoading(false)
        } catch (err) {
            setValidity(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        checkRoom()
    }, [])

    if (valid && !isLoading && websocket == null) {
        const ws = new WebSocket(`ws://localhost:8080/ws/${roomCode}`)
        setWebsocket(ws)
    }

    if (websocket) {
        websocket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            // Event of real time chat
            if (data["type"] === 1) {
                setAllMsg(allMsg.concat(<ReceiveMessage message={data["body"]} key={allMsg.length} />))
            }
            //else if (data["type"] === 2 && url === "") setUrl(data["body"])
            // Event of setting the video for new joiner 
            else if (data["type"] === 2) {
                setUrl(data["body"])
                setSync(data["timestamp"])
            }
            // Event of controlling the current playing video
            else if (data["type"] === 3) setNewTimestamp(data["body"])
        }
    }

    if (isLoading) return ""
    if (valid && !isLoading && websocket != null) {
        return (
            <div className="flex flex-row min-h-screen">
                <div className="flex flex-col justify-evenly items-center basis-3/4">
                    <form onSubmit={handleSubmit} >
                        <label className="mr-4 text-2xl">Video URL</label>
                        <input type="url" className="border-black rounded-lg border-2 p-2" ref={urlRef} />
                        <button type="submit"
                            className="ml-3 border-2 border-white rounded-lg p-2 bg-indigo-500 hover:bg-indigo-600">Search
                    </button>
                    </form>
                    {url && <VideoPlayer url={url} ws={websocket} time={timestamp} sync={sync} setSync={setSync} />}
                </div>
                <div className="grow">
                    <Chat props={{websocket, allMsg, setAllMsg}} />
                </div>
            </div>
        );
    } else {
        return <Error404 />
    }
}

export default Rooms;
