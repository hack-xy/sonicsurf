import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { GameInfoDialog } from "../components/GameInfoDialog"
import { GameNavbar, Navbar } from "../components/Navbar"
import { DifficultyLevel, StartGameDialog } from "../components/StartGameDialog"
import useScript from "../hooks/useScript"


const colors = {
    containerNotObserved: '#252839',
    observedContainer: '#677077'
}

const positions = {
    topLeft: "top-[20%] left-[5%]",
    topRight: "top-[20%] right-[5%]",
    bottomLeft: "bottom-[20%] left-[5%]",
    bottomRight: "bottom-[20%] right-[5%]",
};


const Game = () => {
    const status = useScript('/webgazer.js')
    const [isOpen, setIsOpen] = useState(false)
    const [isInfoOpen, setIsInfoOpen] = useState(false)
    const [trainingCurrentQuad, setTrainingCurrentQuad] = useState<keyof typeof positions>("topLeft")
    const [isTrainingComplete, setIsTrainingComplete] = useState(false)
    const [numberOfClicksLeft, setNumberOfClicksLeft] = useState(5)

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


    const handleTrainingClick = () => {
        if(numberOfClicksLeft==1){
            if(trainingCurrentQuad=="topLeft"){
                setTrainingCurrentQuad("topRight")
                setNumberOfClicksLeft(5)
            } else if(trainingCurrentQuad=="topRight"){
                setTrainingCurrentQuad("bottomRight")
                setNumberOfClicksLeft(5)
            } else if(trainingCurrentQuad=="bottomRight"){
                setTrainingCurrentQuad("bottomLeft")
                setNumberOfClicksLeft(5)
            } else if(trainingCurrentQuad=="bottomLeft"){
                setIsTrainingComplete(true)
                toast.success("Training Complete! Start the game whenever ready!")
                return
            }
        }else{
            setNumberOfClicksLeft(numberOfClicksLeft-1)
        }
    }


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



        console.log('xx')
        toast.info('Training started! Move your eyes to the corners of the screen (as mentioned) to calibrate the model')

    }, [status])
    return (
        <div>
            <GameNavbar
                setSettingsDialogOpen={setIsOpen}
                setInformationDialogOpen={setIsInfoOpen}
                isTrainingComplete={isTrainingComplete}
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

            {!isTrainingComplete && <div onClick={handleTrainingClick} className={"fixed p-6 select-none bg-clip-text text-transparent z-[9999999] max-w-md text-center font-bold bg-gradient-to-r from-blue-400 to-emerald-400 "+ positions[trainingCurrentQuad]}>
                Move your eye, and mouse pointer to here (quadrant-{trainingCurrentQuad}) simultaneously and click on the red dot <span className="text-amber-300 text-xl">{numberOfClicksLeft} times</span>
            </div>}

        </div>
    )
}


export default Game
