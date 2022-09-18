export function Navbar() {
  return <nav className='h-16 py-2'>
    <div className='btn btn-ghost mx-4'>
      <img src='/logo-png.svg' className="w-40" />
    </div>
  </nav>;
}



export function GameNavbar({
  setSettingsDialogOpen,
  setInformationDialogOpen,
  isTrainingComplete,
  startGame,
  currentScore,
  isGameRunning
}: {
  setSettingsDialogOpen: (open: boolean) => void
  setInformationDialogOpen: (open: boolean) => void,
  isTrainingComplete: boolean,
  startGame: () => void,
  currentScore: number,
  isGameRunning: boolean
}) {
  return <nav className='fixed w-full h-16 py-2 flex items-center justify-between px-3 z-[999999999]'>
    <div className='btn btn-ghost mx-4'>
      <img src='/logo-png.svg' className="w-40" />
    </div>

    <div className="font-extrabold text-transparent text-xl animate-pulse bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
      {isTrainingComplete ? 'GAME MODE' : 'TRAINING MODE'}
    </div>


    <div className="flex gap-4">
      <div className="flex text-white justify-center gap-2 items-center px-3 py-2 bg-accent rounded-lg">
        <img src='/emoji-game.svg' className="w-6" />
        <div>
          Score: {currentScore}
        </div>
      </div>

      <button disabled={!isTrainingComplete || isGameRunning} onClick={startGame} className="btn btn-secondary">{isGameRunning? 'Game Running..': 'Start Game'}</button>
      <div onClick={() => setSettingsDialogOpen(true)} className="btn btn-square btn-accent btn-outline"><SettingsIcon /></div>
      <div onClick={() => setInformationDialogOpen(true)} className="btn btn-square btn-accent btn-outline"><InformationCircleIcon /></div>
    </div>

  </nav>;
}


const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)


const InformationCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>


)
