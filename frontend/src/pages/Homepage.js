import {useState} from 'react'
import Typewriter from '../components/Typewriter'
import RoomNumberInput from '../components/RoomNumberInput'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';



const Homepage = () => {
    const [toggleShow, setToggleShow] = useState(false)
    const [code, setCode] = useState(false)
    const navigate = useNavigate()

    const handleCreateRoom = async () => {
        const apiResponse = await axios.get('http://localhost:8080/api-create-room')
        if (apiResponse.data) {
            navigate(`/rooms/${apiResponse.data}`, {replace: true})
        }
    }

    const handleJoinRoom = async () => {
        navigate(`/rooms/${code}`, {replace: true})
        //console.log(code)
    }

    return (
        <div className="flex flex-col max-w-2xl m-auto justify-center min-h-screen">
            <div className="border-2">
                {toggleShow ? <RoomNumberInput setCode={setCode} /> : <Typewriter />}
                <div className="flex flex-row justify-center">
                    {
                        toggleShow ?
                            <button
                                className="border-2 p-5 border-white rounded-lg my-10 mx-10 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-600 w-1/4"
                                onClick={handleJoinRoom} >
                                Join Now
                            </button>
                            :
                            <button
                                className="border-2 p-5 border-white rounded-lg my-10 mx-10 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-600 w-1/4"
                                onClick={handleCreateRoom} >
                                Create Room
                            </button>
                    }
                    <button onClick={() => setToggleShow(!toggleShow)} className="border-2 p-5 border-white rounded-lg my-10 mx-10 text-center bg-indigo-500 text-white font-bold hover:bg-indigo-600 w-1/4">
                        {toggleShow ? "Cancel" : "Join Room"}
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Homepage;
