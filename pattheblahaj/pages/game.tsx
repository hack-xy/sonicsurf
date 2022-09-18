import { useEffect, useRef, useState } from "react"
import { GameInfoDialog } from "../components/GameInfoDialog"
import { GameNavbar, Navbar } from "../components/Navbar"
import { DifficultyLevel, StartGameDialog } from "../components/StartGameDialog"
import useScript from "../hooks/useScript"


const colors = {
    containerNotObserved: '#252839',
    observedContainer: '#677077'
}


const Game = () => {
    const status = useScript('/webgazer.js')
    const [isOpen, setIsOpen] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)

    const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy)
    // const [isGame]

    const handleStartGame = (data: { name: string, difficulty: DifficultyLevel }) => {
        setIsOpen(false)
        // TODO: we're not using name for now!
        setDifficulty(data.difficulty)
    }

    const upLeft = useRef<HTMLDivElement>(null)
    const upRight = useRef<HTMLDivElement>(null)
    const downLeft = useRef<HTMLDivElement>(null)
    const downRight = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (status === 'loading') return;

        const webgazer = (window as any).webgazer;
        // webgazer.showFaceFeedbackBox(true)
        // webgazer.showFaceOverlay(true)
        // webgazer.setVideoElementCanvas(canvasRef.current)
        webgazer.removeMouseEventListeners()

        webgazer.setGazeListener((data: any) => {

            if (!data) {
                return
            }

            if (!upLeft.current || !upRight.current || !downLeft.current || !downRight.current) return


            upLeft.current.style.backgroundColor = colors.containerNotObserved
            upRight.current.style.backgroundColor = colors.containerNotObserved
            downLeft.current.style.backgroundColor = colors.containerNotObserved
            downRight.current.style.backgroundColor = colors.containerNotObserved


            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            if (data.x < viewportWidth / 2 && data.y < viewportHeight / 2) {
                upLeft.current.style.backgroundColor = colors.observedContainer
            } else if (data.x > viewportWidth / 2 && data.y < viewportHeight / 2) {
                upRight.current.style.backgroundColor = colors.observedContainer
            } else if (data.x < viewportWidth / 2 && data.y > viewportHeight / 2) {
                downLeft.current.style.backgroundColor = colors.observedContainer
            } else if (data.x > viewportWidth / 2 && data.y > viewportHeight / 2) {
                downRight.current.style.backgroundColor = colors.observedContainer
            }

        }).begin();

    }, [status])
    return (
        <div>
            <GameNavbar
                setSettingsDialogOpen={setIsOpen}
                setInformationDialogOpen={setIsInfoOpen}

            />

            <div className="quadrant">
                <div ref={upLeft} className="up-left"></div>
                <div ref={upRight} className="up-right"></div>
                <div ref={downLeft} className="down-left"></div>
                <div ref={downRight} className="down-right"></div>
            </div>

            {/* <div className="copy-right">
                <h1>Train-&-Test</h1>
            </div> */}


            <StartGameDialog
                handleSubmit={handleStartGame}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <GameInfoDialog
                isOpen={isInfoOpen}
                setIsOpen={setIsInfoOpen}
            />
        </div>
    )
}


export default Game
