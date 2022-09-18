


import { useState } from 'react'
import { Dialog } from '@headlessui/react'


export enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export function StartGameDialog({
    isOpen,
    setIsOpen,
    handleSubmit
}: {
    isOpen: boolean, setIsOpen: (isOpen: boolean) => void,
    handleSubmit: (data: { name: string, difficulty: DifficultyLevel }) => void
}) {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy)
    const [data, setData] = useState<{ name: string, difficulty: DifficultyLevel }>({ name: '', difficulty: DifficultyLevel.Easy })

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setData({ ...data, [e.target.id]: e.target.value })
    }
    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className='relative z-[999999999]'>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">

                <Dialog.Panel className='w-full max-w-md rounded bg-white'>
                    <div className="flex min-h-full items-center justify-center p-4">

                        <form className='flex flex-col gap-5 w-full'
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(data)
                            }}
                        >
                            <div className="text-xl font-black text-black text-center">Set Difficulty</div>
                            {/* <input onChange={handleDifficultyChange} required className='input w-full' id='name' placeholder='name' /> */}

                            <select onChange={handleDifficultyChange} className='select w-full' required id='difficulty'>
                                <option value={DifficultyLevel.Easy} >{DifficultyLevel.Easy}</option>
                                <option value={DifficultyLevel.Medium}  >{DifficultyLevel.Medium}</option>
                                <option value={DifficultyLevel.Hard}  >{DifficultyLevel.Hard}</option>
                            </select>

                            <div className='flex gap-3 justify-end'>
                                <button type='submit' className='btn btn-secondary'>Save Settings</button>
                                <button type='button' onClick={() => setIsOpen(false)} className='btn btn-secondary btn-outline'>Cancel</button>
                            </div>

                        </form>

                    </div>

                </Dialog.Panel>

            </div>
        </Dialog>
    )
}
