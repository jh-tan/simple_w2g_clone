import {useState} from 'react'
//import ReceiveMessage from '../components/ReceiveMessage'
import SendMessage from '../components/SendMessage'

const Chat = ({props}) => {

    const {websocket, allMsg, setAllMsg} = props

    const [input, setInput] = useState('')
    //const [allMsg, setAllMsg] = useState([])
    const sendMessage = () => {
        console.log("SENT")
        websocket.send(JSON.stringify({
            type: 1,
            body: input
        }))
        setAllMsg(allMsg.concat(<SendMessage message={input} key={allMsg.length} />))
        setInput('')
    }

    const clearMessage = () => {
        setAllMsg([])
    }

    const handleInput = (e) => {
        e.preventDefault();
        setInput(e.target.value)
    }
    return (
        <section className="max-h-0 min-h-full bg-white rounded-lg w-full flex flex-col lg:flex border-2 border-black">
            <div className="flex-1 p-5 space-y-2 chatBox overflow-y-scroll max-h-screen">
                {allMsg}
            </div>
            <div className="flex flex-row p-5">
                <input type="text" placeholder="Say anything" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-400 pl-4 bg-gray-100 rounded-full py-3 pr-5 border-2 border-blue-200" onChange={handleInput} value={input} />
                <div className="ml-5">
                    <button
                        onClick={sendMessage}
                        className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-indigo-800 hover:bg-indigo-500 focus:outline-none" >
                        Send
                    </button>
                </div>
                <button
                    onClick={clearMessage}
                    className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-indigo-800 hover:bg-indigo-500 focus:outline-none" >
                    Clear
                </button>
            </div>
        </section>
    )
}

export default Chat
