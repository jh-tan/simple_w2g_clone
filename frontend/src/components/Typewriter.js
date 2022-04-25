import {useState, useEffect} from 'react'

const TEXTLIST = ['Watch', 'Enjoy', 'Have Fun']

const TYPING = 0
const PAUSING = 1
const DELETING = 2

const TYPING_PAUSE_MS = 1000
const DELETING_INTERVAL = 50
const DELETING_PAUSE_MS = 500

const useTypewriter = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [typewriterText, setTypewriterText] = useState('')
    const [phase, setPhase] = useState(TYPING)

    useEffect(() => {
        switch (phase) {
            case TYPING: {
                const nextText = TEXTLIST[selectedIndex].slice(0, typewriterText.length + 1)
                if (nextText === typewriterText) {
                    setPhase(PAUSING)
                    return
                }
                const timeout = setTimeout(() => {
                    setTypewriterText(TEXTLIST[selectedIndex].slice(0, typewriterText.length + 1))
                }, 250)
                return () => clearTimeout(timeout)
            }
            case DELETING: {
                if (!typewriterText) {
                    const timeout = setTimeout(() => {
                        setSelectedIndex(TEXTLIST[selectedIndex + 1] ? selectedIndex + 1 : 0)
                        setPhase(TYPING)
                    }, DELETING_PAUSE_MS)
                    return () => clearTimeout(timeout)
                }
                const deleteRemaining = TEXTLIST[selectedIndex].slice(0, typewriterText.length - 1)
                const timeout = setTimeout(() => {
                    setTypewriterText(deleteRemaining)
                }, DELETING_INTERVAL)

                return () => clearTimeout(timeout)
            }
            case PAUSING:
            default: {
                const timeout = setTimeout(() => {
                    setPhase(DELETING)
                }, TYPING_PAUSE_MS)
                return () => clearTimeout(timeout)
            }
        }
    }, [typewriterText, selectedIndex, phase])
    return typewriterText
}

const Typewriter = () => {
    const typewriter = useTypewriter();
    return (
        <div>
            <h2 className="lg:block py-12 text-4xl text-center">
                <span className="blinking-cursor">{typewriter}</span>
                <span>Together</span>
            </h2>
        </div>
    )
}
export default Typewriter
