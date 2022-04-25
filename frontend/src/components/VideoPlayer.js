import ReactPlayer from 'react-player'
import {useRef, useEffect, useState} from 'react'

const VideoPlayer = ({url, ws, time, sync, setSync}) => {
    const playerRef = useRef(null);
    const progressMarker = useRef(null)
    const timeBar = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [oldTime, setOldTime] = useState('')
    const config = {
        url: url,
        ref: playerRef,
        playing: isPlaying,
        volume: 0.3,
        controls: false,
        onPause: () => {
            ws.send(JSON.stringify({
                type: 3,
                body: "PAUSE"
            }))
        },
        onPlay: () => {
            ws.send(JSON.stringify({
                type: 3,
                body: "PLAY"
            }))
        },
        onProgress: (progress) => {
            ws.send(JSON.stringify({
                type: 4,
                body: progress.playedSeconds.toString()
            }))
        },
    };

    const handlePlayVideo = () => {
        if (sync != null) {
            playerRef.current.seekTo(sync)
            setSync(null)
        }
        setIsPlaying(true)
    }

    const handlePauseVideo = () => {
        setIsPlaying(false)
    }

    const handleSeek = (e) => {
        const leftOffset = timeBar.current.getClientRects()[0].left
        const totalWidth = timeBar.current.offsetWidth + 15
        const userSeek = e.clientX - leftOffset
        const newTime = userSeek / totalWidth * playerRef.current.getDuration()
        playerRef.current.seekTo(newTime)
        const fraction = newTime / playerRef.current.getDuration() * 100
        progressMarker.current.style.left = fraction + "%"
        ws.send(JSON.stringify({
            type: 3,
            body: newTime.toString()
        }))
    }

    useEffect(() => {
        let interval
        if (time === "PAUSE") {
            setIsPlaying(false)
        }
        else if (time === "PLAY") {
            if (sync != null) {
                playerRef.current.seekTo(sync)
                setSync(null)
            }
            setIsPlaying(true)
        }
        else {
            if (time !== oldTime) {
                playerRef.current.seekTo(time)
                setOldTime(time)
            }
        }

        if (isPlaying) {
            interval = setInterval(() => {
                const fraction = playerRef.current.getCurrentTime() / playerRef.current.getDuration() * 100
                progressMarker.current.style.left = fraction + "%"
            }, 200)
        }
        return () => clearInterval(interval)
    }, [isPlaying, time, oldTime])

    return (
        <div className='player-wrapper'>
            <ReactPlayer className='react-player' {...config} />
            <div className="playerControl mt-3 flex flex-row relative">
                <button className="border-2 border-black bg-white p-1" onClick={handlePlayVideo}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <button className="border-t-2 border-r-2 border-l-2 border-black rotate-90 p-1" onClick={handlePauseVideo}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="progressBar grow self-center ml-2 flex items-center relative">
                    <div className="straightLine border-b-4 border-black min-w-full" ref={timeBar} onClick={handleSeek} ></div>
                    <div className="marker border-2 h-3 w-3 bg-red-500 rounded-full border-black absolute" ref={progressMarker} ></div>
                </div>
            </div>
        </div >
    );
}

export default VideoPlayer

