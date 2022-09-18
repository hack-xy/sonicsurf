import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { GameInfoDialog } from "../components/GameInfoDialog"
import { GameNavbar, Navbar } from "../components/Navbar"
import { DifficultyLevel, StartGameDialog } from "../components/StartGameDialog"
import useScript from "../hooks/useScript"


const colors = {
    containerNotObserved: 'bg-gray-700',
    observedContainer: 'bg-sky-700'
}

const positionsToId = {
    topLeft: 0,
    topRight: 1,
    bottomRight: 2,
    bottomLeft: 3,
}

const idToPositions = {
    0: 'topLeft',
    1: 'topRight',
    2: 'bottomRight',
    3: 'bottomLeft',
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


    const [score, setScore] = useState(0)
    const [isGameRunning, setIsGameRunning] = useState(false)
    const [currentSharkPosition, setCurrentSharkPosition] = useState<keyof typeof positions | -1>(-1)
    const [currentGazedPositions, setCurrentGazedPositions] = useState<number>(0)

    const handleStartGame = (data: { name: string, difficulty: DifficultyLevel }) => {
        setIsOpen(false)
        // TODO: we're not using name for now!
        setDifficulty(data.difficulty)
    }

    const [upLeftClassName, setUpLeftClassName] = useState<string>(colors.containerNotObserved)
    const [upRightClassName, setUpRightClassName] = useState<string>(colors.containerNotObserved)
    const [downLeftClassName, setDownLeftClassName] = useState<string>(colors.containerNotObserved)
    const [downRightClassName, setDownRightClassName] = useState<string>(colors.containerNotObserved)

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

        let interval: ReturnType<typeof setTimeout> | null = null;

        // TODO: game difficulty

        const gameStage = async () => {

            // generate a random position for the shark
            const randomPosition = Math.floor(Math.random() * 100) % 4;
            const position = Object.keys(positions)[randomPosition] as keyof typeof positions
            // set the shark position

            setCurrentSharkPosition(position)

            await new Promise((resolve) => setTimeout(resolve, 1000))

            let myLocalGazedPositions = currentGazedPositions;
            // fix for closure issue
            setCurrentGazedPositions((val) => {
                myLocalGazedPositions = val;
                return val;
            })
            console.log(myLocalGazedPositions)

            let totalInstances = 0;

            console.log('myLocalGazedPositions', myLocalGazedPositions)

            // if (totalInstances === 0) {
            //     toast.warn("You didn't look at the shark! Or maybe the training was incorrect. Please restart if the problem persists.");
            // }


            if (myLocalGazedPositions === randomPosition) {
                setScore(score + 1)
                // CORRECT
            } else {
                // WRONG
                // STOP GAME
                setIsGameRunning(false)
                clearInterval(interval!)
                toast.error("Game Over! You've scored " + score + " points!")
                const webgazer = (window as any).webgazer;
                webgazer.pause();
            }

            // invalidating
            setCurrentSharkPosition(-1)

            // if within 1 second, the gaze is in the same position then increment a point

            // else end game!
        }

        interval = setInterval(gameStage, 1500);

    }


    const gazeHandler = (data: any) => {
        if (!data) {
            return
        }

        setUpLeftClassName(`${colors.containerNotObserved}`)
        setUpRightClassName(`${colors.containerNotObserved}`)
        setDownLeftClassName(`${colors.containerNotObserved}`)
        setDownRightClassName(`${colors.containerNotObserved}`)


        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (data.x < viewportWidth / 2 && data.y < viewportHeight / 2) {
            console.log('CurrentQuadrant: 0')
            setUpLeftClassName(`${colors.observedContainer}`)
            setCurrentGazedPositions(0)
        } else if (data.x > viewportWidth / 2 && data.y < viewportHeight / 2) {
            console.log('CurrentQuadrant: 1')
            setCurrentGazedPositions(1)
            setUpRightClassName(`${colors.observedContainer}`)
        } else if (data.x < viewportWidth / 2 && data.y > viewportHeight / 2) {
            setDownLeftClassName(`${colors.observedContainer}`)
            console.log('CurrentQuadrant: 2')
            setCurrentGazedPositions(3)
        } else if (data.x > viewportWidth / 2 && data.y > viewportHeight / 2) {
            setDownRightClassName(`${colors.observedContainer}`)
            console.log('CurrentQuadrant: 3')
            setCurrentGazedPositions(2)
        }

    }


    useEffect(() => {
        if (status === 'loading') return;

        const webgazer = (window as any).webgazer;
        // webgazer.showFaceFeedbackBox(true)
        // webgazer.showFaceOverlay(true)
        // webgazer.setVideoElementCanvas(canvasRef.current)
        webgazer.removeMouseEventListeners()
        webgazer.setGazeListener(gazeHandler).begin();

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
                isGameRunning={isGameRunning}
            />

            <div className="quadrant fixed w-full bottom-0">
                <div className={`up-left ${upLeftClassName}`}>
                    {currentSharkPosition === 'topLeft' && <img src="/shark1.svg" className="fixed top-1/4 -translate-y-1/4 w-96" />}
                </div>
                <div className={`up-right ${upRightClassName}`}>
                    {currentSharkPosition === 'topRight' && <img src="/shark1.svg" className="fixed top-1/4 -translate-y-1/4 w-96" />}

                </div>
                <div className={`down-left ${downLeftClassName}`}>
                    {currentSharkPosition === 'bottomLeft' && <img src="/shark1.svg" className="fixed top-1/4 -translate-y-1/4 w-96" />}

                </div>
                <div className={`down-right ${downRightClassName}`}>
                    {currentSharkPosition === 'bottomRight' && <img src="/shark1.svg" className="fixed top-1/4 -translate-y-1/4 w-96" />}

                </div>
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
