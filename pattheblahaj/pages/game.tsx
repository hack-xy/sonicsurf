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

const positionsToId = {
    topLeft: 0,
    topRight: 1,
    bottomRight: 2,
    bottomLeft: 3,
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

    const [score, setScore] = useState(0)
    const [isGameRunning, setIsGameRunning] = useState(false)
    const [currentSharkPosition, setCurrentSharkPosition] = useState<keyof typeof positions>("topLeft")
    const [gazedPositions, setGazedPositions] = useState<Record<number,number>>({
        0: 0,
        1: 0,
        2: 0,
        3: 0
    })

    const handleStartGame = (data: { name: string, difficulty: DifficultyLevel }) => {
        setIsOpen(false)
        // TODO: we're not using name for now!
        setDifficulty(data.difficulty)
    }

    const upLeft = useRef<HTMLDivElement>(null)
    const upRight = useRef<HTMLDivElement>(null)
    const downLeft = useRef<HTMLDivElement>(null)
    const downRight = useRef<HTMLDivElement>(null)
    const refs = [upLeft, upRight, downRight, downLeft]

    const handleTrainingClick = () => {
        if (numberOfClicksLeft == 1) {
            if (trainingCurrentQuad == "topLeft") {
                setTrainingCurrentQuad("topRight")
                setNumberOfClicksLeft(5)
            } else if (trainingCurrentQuad == "topRight") {
                setTrainingCurrentQuad("bottomRight")
                setNumberOfClicksLeft(5)
            } else if (trainingCurrentQuad == "bottomRight") {
                setTrainingCurrentQuad("bottomLeft")
                setNumberOfClicksLeft(5)
            } else if (trainingCurrentQuad == "bottomLeft") {
                setIsTrainingComplete(true)
                toast.success("Training Complete! Start the game whenever ready!")
                const webgazer = (window as any).webgazer;
                webgazer.pause();
                return
            }
        } else {
            setNumberOfClicksLeft(numberOfClicksLeft - 1)
        }
    }

    const startGame = () => {
        // TODO: add a listener 
        (window as any).webgazer.resume()
        setIsGameRunning(true)
        setGazedPositions({
            0: 0,
            1: 0,
            2: 0,
            3: 0
        })

        let interval: ReturnType<typeof setTimeout> | null=null;

        // TODO: game difficulty

        const gameStage = () => {

            // generate a random position for the shark
            const randomPosition = Math.floor(Math.random() * 100) % 4;
            const position = Object.keys(positions)[randomPosition] as keyof typeof positions
            // set the shark position

            setCurrentSharkPosition(position)
            refs[randomPosition].current?.classList.add("active");

            (window as any).webgazer.setGazeListener((data: any) => {
                if (!data) {
                    return
                }
                if (!upLeft.current || !upRight.current || !downLeft.current || !downRight.current) return
    
            }).begin()


            setTimeout(() => {
                let totalInstances=0;
                [0,1,2,3].forEach((key)=>{
                    totalInstances+=gazedPositions[key]
                })
                console.log(totalInstances, gazedPositions)


                if(gazedPositions[randomPosition] >= totalInstances/2){
                    setScore(score+1)
                    // CORRECT
                }else{
                    // WRONG
                    // STOP GAME
                    setIsGameRunning(false)
                    clearInterval(interval!)
                    toast.error("Game Over! You've scored "+score+" points!")
                    const webgazer = (window as any).webgazer;
                    webgazer.pause();
                }

                // remove the active class
                refs[randomPosition].current?.classList.remove("active")
            }, 1000)

            // if within 1 second, the gaze is in the same position then increment a point

            // else end game!
        }

        interval=setInterval(gameStage, 1500);


      
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
                if(isGameRunning) setGazedPositions({...gazedPositions, 0: gazedPositions[0] + 1})
            } else if (data.x > viewportWidth / 2 && data.y < viewportHeight / 2) {
                if(isGameRunning) setGazedPositions({...gazedPositions, 1: gazedPositions[1] + 1})
                upRight.current.style.backgroundColor = colors.observedContainer
            } else if (data.x < viewportWidth / 2 && data.y > viewportHeight / 2) {
                downLeft.current.style.backgroundColor = colors.observedContainer
                if(isGameRunning) setGazedPositions({...gazedPositions, 3: gazedPositions[3] + 1})
            } else if (data.x > viewportWidth / 2 && data.y > viewportHeight / 2) {
                downRight.current.style.backgroundColor = colors.observedContainer
                if(isGameRunning) setGazedPositions({...gazedPositions, 2: gazedPositions[2] + 1})
            }

        }).begin();


        toast.info('Training started! Move your eyes to the corners of the screen (as mentioned) to calibrate the model')

    }, [status])
    return (
        <div>
            <GameNavbar
                currentScore={score}
                setSettingsDialogOpen={setIsOpen}
                setInformationDialogOpen={setIsInfoOpen}
                isTrainingComplete={isTrainingComplete}
                startGame={startGame}
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

            {!isTrainingComplete && <div onClick={handleTrainingClick} className={"fixed p-6 select-none bg-clip-text text-transparent z-[9999999] max-w-md text-center font-bold bg-gradient-to-r from-blue-400 to-emerald-400 " + positions[trainingCurrentQuad]}>
                Move your eye, and mouse pointer to here (quadrant-{trainingCurrentQuad}) simultaneously and click on the red dot <span className="text-amber-300 text-xl">{numberOfClicksLeft} times</span>
            </div>}

            {/* <div className="absolute text-green-500 top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[9999999999999]">
                Correct
            </div> */}
        </div>
    )
}


export default Game
