import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { Navbar } from '../components/Navbar'

const Home: NextPage = () => {
  return (
    <div className={styles.bgContainer}>

      <Navbar />

      <div className={styles.mainContainer}>
        <div>
          <div className='flex mt-20 flex-col items-center'>
            <div className="max-w-2xl text-center">
              <div className='text-4xl font-bold '>
                Human Wastes have extensively affected Water Bodies, &amp; toxic levels are critical ⚠️ ☢️
              </div>
              <div className='text-3xl mt-5 font-bold '>
                Help Blahaj in navigating through the ocean!
              </div>
            </div>

            <Link href='/game'>
              <button className="btn mt-7 btn-primary">
                Start Game
              </button>
            </Link>
          </div>
        </div>

        <footer className='text-gray-400 py-4 flex gap-4'>
          <div className='border-r-2 px-4 border-gray-300'>Crafted with 💙 for Impractical Hackers 2</div>
          <img src="/MLH-logo.svg" className='w-16' />
        </footer>
      </div>
    </div>

  )
}

export default Home



