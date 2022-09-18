import { Dialog } from '@headlessui/react'

export function GameInfoDialog({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean, setIsOpen: (isOpen: boolean) => void,
}) {


    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className='relative z-[999999999]'>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">

                <Dialog.Panel className='w-full max-w-md rounded bg-white'>
                    <div className="flex flex-col min-h-full items-center justify-center p-4">
                        <div className="text-2xl font-black text-black text-center">Info</div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                Human Wastes have extensively affected Water Bodies, & toxic levels are critical ⚠️ ☢️
                            </div>

                            <div>
                                Help Blahaj move to safe water every 1/1.5 seconds, & staying more than 2 seconds in bad water will kill Blahaj

                            </div>

                            <div>
                                25% (any single quadrant in random order) = Safe

                            </div>

                            <div>
                                75% (rest three quadrants) = Unsafe
                            </div>

                            <div>
                                Note : Blahaj can move through different water bodies to change position (i.e. it can move through bad water, but staying there for more than 2 seconds will kill it)
                            </div>
                        </div>
                    </div>



                </Dialog.Panel>

            </div>
        </Dialog>
    )
}
